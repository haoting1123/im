package com.synto.um.service;

import com.synto.im.license.model.ImLicense;
import com.synto.im.license.repository.ImLicenseRepository;
import com.synto.im.miniprogram.model.GroupMiniProgram;
import com.synto.im.miniprogram.model.MiniProgram;
import com.synto.im.miniprogram.repository.GroupMiniProgramRepository;
import com.synto.im.miniprogram.repository.MiniProgramRepository;
import com.synto.um.admin.service.UserAdminService;
import com.synto.um.dao.GroupDao;
import com.synto.um.model.Group;
import com.synto.um.model.vo.GroupUserVO;
import com.synto.um.model.User;
import com.synto.um.model.vo.UserVO;
import com.synto.um.query.OfVcardQuery;
import com.synto.um.query.UserstatusQuery;
import com.synto.um.query.model.OfVcard;
import com.synto.um.repository.GroupRepository;
import com.synto.um.repository.GroupVisibleRepository;
import com.synto.um.repository.RoleRepository;
import com.synto.um.repository.UserRepository;
import com.synto.util.UserUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 组织机构业务类
 */
@Slf4j
@Service
public class GroupService {

    @Autowired
    GroupDao groupDao;

    @Autowired
    ImLicenseRepository imLicenseRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    GroupVisibleRepository groupVisibleRepository;
    @Autowired
    GroupMiniProgramRepository groupSmallProgramRepository;
    @Autowired
    MiniProgramRepository smallProgramRepository;

    @Autowired
    OfVcardQuery ofVcardQuery;
    @Autowired
    UserstatusQuery userstatusQuery;
    @Autowired
    UserAdminService userAdminService;

    /**
     * 只查询group树(无缓存)
     * 查询出直属机构树
     * 同时，会将非直属的下级机构查询出来
     */
    public Group selectGroup(String code) {
        Group root = groupRepository.findByCode(code).get(0);
        if (root == null) {
            return null;
        }
        return selectTree(root);
    }

    private Group selectTree(Group group) {
        String code = group.getCode();
        List<Group> children = groupRepository.findByParentCode(code);
        List<Group> superiorChildren = groupRepository.findBySuperiorCode(code);
        if (superiorChildren != null) {
            children.addAll(superiorChildren);
        }
        if (children != null) {
            Collections.sort(children, new Comparator<Group>() {
                @Override
                public int compare(Group g1, Group g2) {
                    if (g1.getGsequence() != null && g2.getGsequence() != null) {
                        if (g1.getGsequence() > g2.getGsequence()) {
                            return 1;
                        } else if (g1.getGsequence() < g2.getGsequence()) {
                            return -1;
                        } else {
                            return g1.getGroupName().compareTo(g2.getGroupName()); // 调用String中的compareTo()方法
                        }
                    }
                    return 2;
                }
            });
            group.setChildren(children);
            for (Group child : children) {
                selectTree(child);
            }
        }
        return group;
    }

    /**
     * 得到group树
     * group转成VO
     */
    public GroupUserVO selectGroupVO(String code) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.GroupService：selectGroupVO方法");
        Group root = groupRepository.findByCode(code).get(0);
        if (root == null) {
            return null;
        }
        GroupUserVO groupUserVO = changeToVO(root);
        return getGroupTree(root, groupUserVO, false);
    }

    /**
     * 返回包装类,同时获得该组织下的普通user
     *
     * @param code
     * @return
     */
    public GroupUserVO selectVOGroup(String code) {
        Group root = groupRepository.findByCode(code).get(0);
        GroupUserVO groupUserVO = changeToVO(root);
        if (root == null) {
            return null;
        }
        GroupUserVO gUVO = getGroupTree(root, groupUserVO, true);
        return setUser(gUVO);
    }

    /**
     * 插入user
     *
     * @param groupUserVO
     * @return
     */
    private GroupUserVO setUser(GroupUserVO groupUserVO) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.GroupService：setUser方法");
        String groupCode = groupUserVO.getId();
        List<User> users = userRepository.findByGroupCode(groupCode);
        List<GroupUserVO> userVOS = changeUserToVOList(users);
        List<GroupUserVO> children = groupUserVO.getChildren();
        if (children != null) {
            for (GroupUserVO groupChild : children) {
                setUser(groupChild);
            }
        }
        children.addAll(userVOS);
        groupUserVO.setChildren(children);
        return groupUserVO;
    }

    private GroupUserVO getGroupTree(Group group, GroupUserVO groupUserVO, boolean directly) {
        if (group.getCode().equals(group.getParentCode()))
            return groupUserVO;

        String code = group.getCode();
        List<Group> children = groupRepository.findByParentCode(code);
        List<GroupUserVO> groupUserVOS = new ArrayList<>();

        if (!directly) {
            List<Group> superiorChildren = groupRepository.findBySuperiorCode(code);
            if (superiorChildren != null) {
                children.addAll(superiorChildren);
            }
        }

        if (children != null) {
            Collections.sort(children, new Comparator<Group>() {
                @Override
                public int compare(Group g1, Group g2) {
                    if (g1.getGsequence() != null && g2.getGsequence() != null) {
                        if (g1.getGsequence() > g2.getGsequence()) {
                            return 1;
                        } else if (g1.getGsequence() < g2.getGsequence()) {
                            return -1;
                        } else {
                            return g1.getGroupName().compareTo(g2.getGroupName()); // 调用String中的compareTo()方法
                        }
                    }
                    return 2;
                }
            });
            groupUserVOS = changeList(children);
            groupUserVO.setChildren(groupUserVOS);
            for (int i = 0; i < children.size(); i++) {
                getGroupTree(children.get(i), groupUserVOS.get(i), directly);
            }
        }
        return groupUserVO;
    }

    /**
     * 添加直属树
     */
    public Group saveGroup(Group group) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.service.GroupService：saveGroup方法");
        String parentCode = group.getParentCode();
        if (parentCode != null) {
            String code = group.getCode();
            code = parentCode + "&" + code;
            group.setCode(code);
        }

        return groupRepository.save(group);
    }

    /**
     * 添加独立树
     */
    public Group saveIndependGroup(Group group) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.service.GroupService：saveIndependGroup方法");
        String superiorCode = group.getSuperiorCode();
        if (superiorCode != null) {
            String code = group.getCode();
            code = superiorCode + "&" + code;
            group.setCode(code);
        }
        return groupRepository.save(group);
    }

    /**
     * 转换成group的包装类
     */
    public GroupUserVO changeToVO(Group group) {
        GroupUserVO groupVO = new GroupUserVO();
        groupVO.setId(group.getCode());
        groupVO.setLabel(group.getGroupName());
        groupVO.setSign("group");
        return groupVO;
    }

    public List<GroupUserVO> changeList(List<Group> children) {
        List<GroupUserVO> list = new ArrayList();
        for (Group child : children) {
            list.add(changeToVO(child));
        }
        return list;
    }

    /**
     * 转换成user的包装类
     */
    public GroupUserVO changeUserToVO(User user) {
        GroupUserVO userVO = new GroupUserVO();
        userVO.setId(user.getUsername());
        userVO.setLabel(user.getName());
        userVO.setSign("user");
        return userVO;
    }

    public List<GroupUserVO> changeUserToVOList(List<User> users) {
        List<GroupUserVO> list = new ArrayList();
        for (User user : users) {
            list.add(changeUserToVO(user));
        }
        return list;
    }

    /**
     * 删除Group及其子节点 并删除授权信息
     */
    public Group deleteGroup(String code) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.service.GroupService：deleteGroup方法");
        Group root = selectGroup(code);
        if (root == null) {
            return null;
        }
        deleteChildren(root);
//        imLicenseRepository.deleteByGroupCode(code);
//        userAdminService.deleteAdmin(code);
        return root;
    }

    /**
     * 删除子机构并删除管理员  并删除授权信息
     *
     * @param group
     */
    private void deleteChildren(Group group) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.service.GroupService：deleteChildren方法");
        List<Group> children = group.getChildren();
        //      删除管理员 和授权文件
        imLicenseRepository.deleteByGroupCode(group.getCode());
        userAdminService.deleteAdmin(group.getCode());
        //      删除机构用户信息
        userRepository.deleteByGroupCode(group.getCode());
        if (children != null && children.size() > 0) {
            for (Group child : children) {
                deleteChildren(child);
            }
        }
        groupRepository.delete(group);
        groupVisibleRepository.deleteByGroupCode(group.getCode());
    }

    /**
     * 修改
     */
    public Group updateGroup(Group group) {
        Optional<Group> byId = groupRepository.findById(group.getId());
        Group oldGroup = byId.get();
        String oldCode = oldGroup.getCode();
        String newCode = group.getCode();
        groupRepository.delete(oldGroup);
        Group upGroup = groupRepository.save(group);
        if (!oldCode.equals(newCode)) {
            groupRepository.updateParentCode(newCode, oldCode);
            groupRepository.updateSuperiorCode(newCode, oldCode);
            userRepository.updateGroupCode(newCode, oldCode);
        }
        return upGroup;
    }

    /**
     * 节点拖拽排序
     *
     * @param dragCode
     * @param dropCode
     * @param parentCode
     * @param dropType
     * @return
     */
    public List<Group> treeSequence(String dragCode, String dropCode, String parentCode, String dropType) {
        Sort sort = new Sort(Sort.Direction.ASC, "gsequence");
        List<Group> groupList = groupRepository.findByParentCodeOrSuperiorCode(parentCode, parentCode, sort);
        List<Group> newList = new ArrayList<>();
        Group currGroup = groupRepository.findByCode(dragCode).get(0);

        groupList.stream().forEach(item -> {
            if (item.getCode().equals(dragCode)) {
                return;
            }
            if (item.getCode().equals(dropCode)) {
                if (dropType.equals("before")) {
                    newList.add(currGroup);
                    newList.add(item);
                } else if (dropType.equals("after")) {
                    newList.add(item);
                    newList.add(currGroup);
                } else {
                    newList.add(item);
                }
            } else {
                newList.add(item);
            }
        });

        for (int i = 0; i < newList.size(); i++) {
            newList.get(i).setGsequence(i);
        }

        groupRepository.saveAll(newList);

        return newList;
    }

    /**
     * 得到该组织的普通user
     */
    public List<UserVO> getUsers(String groupCode) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.service.GroupService：getUsers方法");
        List<User> users = userRepository.findByGroupCodeAndIdentity(groupCode, "1");
        List<UserVO> voList = new ArrayList<>();
        for (User user : users) {
            UserUtils.filterInfo(user);
            UserVO vo = new UserVO();
            BeanUtils.copyProperties(user, vo);

            OfVcard ofVcard = ofVcardQuery.findFirstByUsername(user.getUsername());
            if (ofVcard != null) {
                String photo = UserUtils.getUserPhoto(ofVcard.getVcard());
                if (StringUtils.isNotBlank(photo)) {
                    vo.setPhoto(photo);
                }
            }

            vo.setOnline(userstatusQuery.findCountByUsernameAndOnline(user.getUsername(), 1));

//            vo.setVcard(ofVcard == null ? "" : ofVcard.getVcard());
            voList.add(vo);
        }
        return voList;
    }

    /**
     * 获取直属机构树， 不包含非直属的下级机构
     */
    public GroupUserVO getDirectlyTree(String groupCode) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.service.GroupService：getDirectlyTree方法");
        if (groupCode == null) {
            return null;
        }
        String rootCode = getRootCode(groupCode);
        if (StringUtils.isNotBlank(rootCode)) {
            Sort sort = new Sort(Sort.Direction.ASC, "gsequence");
            List<Group> rootList = groupRepository.findByCode(rootCode, sort);
            if (rootList.size() > 0) {
                GroupUserVO groupUserVO = changeToVO(rootList.get(0));
                return directlyTree(rootList.get(0), groupUserVO);
            }
        }
        return null;
    }

    public String getRootCode(String groupCode) {
        List<Group> groupList = groupRepository.findByCode(groupCode);
        if (groupList.size() > 0) {
            Group code = groupList.get(0);
            String parentCode = code.getParentCode();
            if (StringUtils.isEmpty(parentCode) || parentCode.equals("-1")) {
                return groupCode;
            }
            return getRootCode(code.getParentCode());
//            groupCode=parentCode;
        }
//        List<Group> group = groupRepository.findByCode(groupCode);
//        if (group.size()>0){
//            return group.get(0).getCode();
//        }
        return null;
    }

    /**
     * 查询组织机构带分页  并且查询授权信息
     *
     * @param list
     * @return
     */
    public Page<Group> getOrganizePage(Page<Group> list) {
        for (Group group : list) {
            List<Group> organize = groupRepository.findByCode(group.getSuperiorCode());
//          获得组织机构已激活得授权信息
            ImLicense imLicense = imLicenseRepository.getImLicenseManage(group.getCode());
            if (imLicense != null) {
                group.setImLicense(imLicense);
            }
//            Group organize=groupRepository.findByCode(group.getSuperiorCode()).get(0);
            if (organize.size() > 0) {
                group.setSuperiorName(organize.get(0).getGroupName());
            }
        }
        return list;
    }


    private GroupUserVO directlyTree(Group group, GroupUserVO groupUserVO) {
        if (group.getCode().equals(group.getParentCode()))
            return groupUserVO;

        String code = group.getCode();
        List<Group> children = groupRepository.findByParentCode(code);
        List<GroupUserVO> groupUserVOS = new ArrayList<>();
        if (children != null) {
            Collections.sort(children, new Comparator<Group>() {
                @Override
                public int compare(Group g1, Group g2) {
                    if (g1.getGsequence() != null && g2.getGsequence() != null) {
                        if (g1.getGsequence() > g2.getGsequence()) {
                            return 1;
                        } else if (g1.getGsequence() < g2.getGsequence()) {
                            return -1;
                        } else {
                            return g1.getGroupName().compareTo(g2.getGroupName()); // 调用String中的compareTo()方法
                        }
                    }
                    return 2;
                }
            });
            groupUserVOS = changeList(children);
            groupUserVO.setChildren(groupUserVOS);
            for (int i = 0; i < children.size(); i++) {
                directlyTree(children.get(i), groupUserVOS.get(i));
            }
        }
        return groupUserVO;
    }

    public int savaSmallprogram(String groupCode, List<String> programCode) {
        List<GroupMiniProgram> list = new ArrayList<>();
        for (String s : programCode) {
            GroupMiniProgram gsp = new GroupMiniProgram();
            gsp.setGroupCode(groupCode);
            gsp.setProgramCode(s);
            list.add(gsp);
        }
        groupSmallProgramRepository.deleteByGroupCode(groupCode);
        groupSmallProgramRepository.saveAll(list);
        return 1;
    }

    public List<MiniProgram> findSmallProgramByGroupCode(String groupCode) {
        List<GroupMiniProgram> gspList = groupSmallProgramRepository.findByGroupCode(groupCode);
        List<String> codeList = gspList.stream().map(GroupMiniProgram::getProgramCode).collect(Collectors.toList());
        return smallProgramRepository.findByCodeIn(codeList);
    }

    /**
     * 根据code获得group树(缓存)
     *
     * @param
     * @return
     */
    /*public Group getGroupTree(String groupCode){
        Group root = groupDao.getByCode(groupCode);
        if (root==null){
            return null;
        }
        return findGroupTree(root);
    }

    public Group getGroupTreeRoleUser(String groupCode){
        Group root = groupDao.getByCode(groupCode);
        //获取group的同时获取List<User>和List<Role>
        if (root==null){
            return null;
        }
        List<User> users = userRepository.findByGroupCode(groupCode);
        root.setUsers(users);
        return findGroupTree(root);
    }*/

   /* private Group findGroupTree(Group group){
        String code = group.getCode();
        List<Group> children = groupDao.getChildren(code);
        if (children!=null) {
            group.setChildren(children);
            for (Group child:children) {
                findGroupTree(child);
            }
        }
        return group;
    }*/

//  动态查询
    public Page<Group> findAll(String code, String userName, String superOrgCode, String orgCode, Pageable pageable) {
        Page<Group> list = groupRepository.findAll(new Specification<Group>() {
            @Override
            public Predicate toPredicate(Root<Group> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                List<Predicate> list = new ArrayList<Predicate>();
                list.add(criteriaBuilder.like(root.get("parentCode").as(String.class), code));
                if (StringUtils.isNoneBlank(userName)) {
                    list.add(criteriaBuilder.like(root.get("groupName").as(String.class), "%" + userName + "%"));
                }

                if (StringUtils.isNotBlank(superOrgCode)) {
                    list.add(criteriaBuilder.like(root.get("superiorCode").as(String.class), "%" + superOrgCode + "%"));
                }

                if (StringUtils.isNotBlank(orgCode)) {
                    list.add(criteriaBuilder.like(root.get("code").as(String.class), "%" + orgCode + "%"));
                }

                Predicate[] p = new Predicate[list.size()];
                return criteriaBuilder.and(list.toArray(p));
            }
        }, pageable);
        list = getOrganizePage(list);
        return list;
    }
}
