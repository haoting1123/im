package com.synto.um.service;

import com.google.common.collect.Lists;
import com.synto.core.security.service.SecurityService;
import com.synto.openfire.service.OpenfireService;
import com.synto.um.model.Group;
import com.synto.um.model.Notice;
import com.synto.um.model.NoticeScope;
import com.synto.um.model.User;
import com.synto.um.model.vo.GroupUserVO;
import com.synto.um.query.OfPropertyQuery;
import com.synto.um.repository.NoticeRepository;
import com.synto.um.repository.NoticeScopeRepository;
import com.synto.um.repository.UserRepository;
import lombok.SneakyThrows;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class NoticeService {

    @Autowired
    NoticeRepository noticeRepository;

    @Autowired
    NoticeScopeRepository noticeScopeRepository;
    @Autowired
    OpenfireService openfireService;

    @Autowired
    OfPropertyQuery ofPropertyQuery;

    @Autowired
    GroupService gservice;
    @Autowired
    SecurityService secService;
    @Autowired
    UserRepository userRepo;

    /**
     * 分页查询
     */
    public Page<Notice> getAll(int page,int size){
        Sort sort=new Sort(Sort.Direction.DESC,"createTime");
        PageRequest pageRequest=PageRequest.of(page-1,size,sort);
        Page<Notice> all = noticeRepository.findAll(pageRequest);
        return all;
    }


    /**
     * 添加Notice
     */
    public void addNotice(Notice notice){
        if(StringUtils.isEmpty(notice.getOrganizeInfo()))
            notice.setOrganizeInfo(null);
        Notice n = noticeRepository.save(notice);
        if (notice.getScope()!=null){
            NoticeScope noticeScope=new NoticeScope();
            noticeScope.setNoticeId(notice.getId());
            noticeScope.setScope(notice.getScope());
            noticeScope.setCodes(notice.getCodes());
            noticeScopeRepository.save(noticeScope);
        }
    }


    /**
     * 平台管理员添加公告，组织机构需要递归获取全部的子机构
     */
    public void addNoticeRoot(Notice notice) {
        if (!StringUtils.isEmpty(notice.getOrganizeInfo())) {
            StringBuilder gcodes = new StringBuilder();
            String[] codes = notice.getOrganizeInfo().split(",");
            //递归调用，获取所有的组织机构
            for (String code : codes) {
                if (StringUtils.isEmpty(code))
                    continue;
                GroupUserVO groups = gservice.getDirectlyTree(code);
                visit(groups,gcodes);
            }
            notice.setOrganizeInfo(gcodes.toString());
        } else {
            notice.setOrganizeInfo(null);
        }
        addNotice(notice);
    }

    void visitGroup(Group vo, StringBuilder str) {
        if(vo == null)
            return ;
        str.append( vo.getCode()).append(",");
        if(vo.getChildren()!=null)
            vo.getChildren().stream().forEach(g->visitGroup(g, str));
    }

    void visit(GroupUserVO vo, StringBuilder str) {
        if(vo == null)
            return ;
        str.append( vo.getId()).append(",");
        if(vo.getChildren()!=null)
            vo.getChildren().stream().forEach(g->visit(g, str));
    }

    /**
     * 给在线用户 发送公告
     * @param id
     */
    public void sendNotice(String id){
        Notice notice = noticeRepository.findById(Long.parseLong(id)).get();
        // 给在线的人发送公告
        openfireService.sendNotice(notice);
    }

    /**
     * 获取公告
     * @param readId
     * @return
     */
    public Notice findUnreadNotice(String readId){
        if(StringUtils.isNotBlank(readId)){
            return noticeRepository.findTopByIdAfterOrderByIdDesc(Long.parseLong(readId));
        }else{
            return noticeRepository.findTopByOrderByIdDesc();
        }
    }

    /**
     * 获取范围内的最新100条公告
     * @return
     */
    public List<Notice> findTop100ByCodes(){
        String username = secService.currentUsername();
        User u = userRepo.findByUsername(username);
        List<Notice> resList = new ArrayList<>();

        List<Notice> noticePage = noticeRepository.findByOrderByIdDesc();
        for (Notice notice : noticePage) {
            if(checkNoticeCodes(notice, u.getGroupCode(), u.getGroupRootCode())){
                resList.add(notice);
            }
            if(resList.size() >= 100){
                break;
            }
        }

        return resList;
    }

    /**
     * 获取公告
     * @param readId
     * @return
     */
    public Notice findUnreadNotice(String readId, String groupCode, String groupRootCode){
        if(StringUtils.isNotBlank(readId)){
            List<Notice> ns = noticeRepository.findByIdAfterOrderByIdDesc(Long.parseLong(readId));
            return latestNotic(ns, groupCode, groupRootCode);

        }else{
            List<Notice> ns = noticeRepository.findByOrderByIdDesc();
            return latestNotic(ns, groupCode, groupRootCode);
        }
    }

    private Notice latestNotic(List<Notice> ns, String groupCode, String groupRootCode) {
        if(ns == null)
            return null;
        for(Notice n:ns) {
            if(checkNoticeCodes(n, groupCode, groupRootCode)){
                return n;
            }
        }
        return null;
    }

    /**
     * 校验公告范围
     * @param notice
     * @param groupCode
     * @param groupRootCode
     * @return
     */
    private boolean checkNoticeCodes(Notice notice, String groupCode, String groupRootCode){
        if(StringUtils.isEmpty(notice.getOrganizeInfo())) {
            // superAdmin发布的给平台所有人
            if(notice.getCodes().equals("-1"))
                return true;
            // 机构管理员发布的给机构所有人
            if(notice.getCodes().equals(groupRootCode))
                return true;
            // 非当前用户根机构
            return false;
        }
        String[] codes = notice.getOrganizeInfo().split(",");
        for(String code : codes){
            if(code.equals(groupCode))
                return true;
        }
        return false;
    }

    /**
     * 根据scope和codes查找
     */

    /**
     * 根据标题、内容、时间多条件查询
     */
    public Page<Notice> findByAll(Map params,PageRequest pageRequest){
        //动态拼接sql
        Specification querySpeci = new Specification() {
            /**
             * @param *root: 代表查询的实体类.
             * @param query: 可以从中可到 Root 对象, 即告知 JPA Criteria 查询要查询哪一个实体类. 还可以
             * 来添加查询条件, 还可以结合 EntityManager 对象得到最终查询的 TypedQuery 对象.
             * @param *cb: CriteriaBuilder 对象. 用于创建 Criteria 相关对象的工厂. 当然可以从中获取到 Predicate 对象
             * @return: *Predicate 类型, 代表一个查询条件.
             */
            @SneakyThrows
            @Override
            public Predicate toPredicate(Root root, CriteriaQuery criteriaQuery, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = Lists.newArrayList();
                predicates.add(criteriaBuilder.like(root.get("codes"), "%" +params.get("codes") + "%"));
                if((params.get("title")!=null) && (!StringUtils.isEmpty(params.get("title").toString()))) {
                    predicates.add(criteriaBuilder.like(root.get("title"), "%" + params.get("title").toString() + "%"));
                }
                if((params.get("content")!=null) && (!StringUtils.isEmpty(params.get("content").toString()))) {
                    predicates.add(criteriaBuilder.like(root.get("content"), "%" + params.get("content").toString() + "%"));
                }
                if((params.get("startTime")!=null) && ((params.get("endTime")!=null)) ) {
                    if((!StringUtils.isEmpty(params.get("startTime").toString())) && (!StringUtils.isEmpty(params.get("endTime").toString()))) {
                        SimpleDateFormat sdfmat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                        predicates.add(criteriaBuilder.between(root.get("createTime").as(Date.class),sdfmat.parse(params.get("startTime").toString()),sdfmat.parse(params.get("endTime").toString())));
                    }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        //Page<Notice> allList = noticeRepository.findByCodes(codes,pageRequest);
        Page<Notice> allList = noticeRepository.findAll(querySpeci,pageRequest);
        return allList;
    }
}
