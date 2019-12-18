package com.synto.um.rs;

import com.synto.core.jpa.SyntoRepository;
import com.synto.core.rs.ResourceNotFoundException;
import com.synto.core.rs.SyntoEntityRest;
import com.synto.core.security.service.SecurityService;
import com.synto.um.admin.model.UserAdmin;
import com.synto.um.admin.service.UserAdminService;
import com.synto.um.model.Notice;
import com.synto.um.model.User;
import com.synto.um.repository.NoticeRepository;
import com.synto.um.repository.UserRepository;
import com.synto.um.service.NoticeService;
import com.synto.um.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 公告信息管理
 */
@Component
@Path("/notice")
public class NoticeResource extends SyntoEntityRest<Notice>{

    @Autowired
    NoticeRepository noticeRepository;

    @Autowired
    UserRepository userRepo;

    @Autowired
    NoticeService noticeService;

    @Autowired
    SecurityService secService;

    @Autowired
    UserAdminService userAdminService;

    @Autowired
    UserService userService;

    @Override
    public SyntoRepository<Notice> getRepo() {
        return noticeRepository;
    }

    /**
     * 得到所有Notice 标题模糊查询
     * @param
     * @return
     */
    @POST
    @Path("/get")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public Page<Notice> getAll(@QueryParam("page") int page,
                                 @QueryParam("size") int size,
                               @QueryParam("title") String title,
                               @QueryParam("content") String content,
                               @QueryParam("codes") String codes,
                               @QueryParam("startTime") String startTime,@QueryParam("endTime") String endTime
                               ){
        System.out.println("我来了发布内容是"+content+"=========开始时间是："+startTime);
        UserAdmin currentUser = userAdminService.getCurrentAdminUser();
        // 判断是否为管理员用户
        if(currentUser!=null){
            Sort sort=new Sort(Sort.Direction.DESC,"createTime");
            PageRequest pageRequest=PageRequest.of(page-1,size,sort);
            Page<Notice> allList = noticeRepository.findByCodes(codes,pageRequest);
            Map params = new HashMap();
            if (codes != null && !codes.isEmpty()) {
                params.put("codes",codes);
            }
            if (title != null && !title.isEmpty()) {
              params.put("title",title);
            }
            if(content != null && !content.isEmpty()){
                params.put("content",content);
            }
            if(startTime != null && !startTime.isEmpty()){
                params.put("startTime",startTime);
            }
            if(endTime != null && !endTime.isEmpty()){
                params.put("endTime",endTime);
            }
            if(params != null){
                allList = noticeService.findByAll(params,pageRequest);
            }

           /* if (title != null && !title.isEmpty()) {
                // 根据公告标题模糊查询
                allList = noticeRepository.findByTitleLikeAndCodes("%"+title+"%",codes,pageRequest);
            }*/
            return allList;
        }
        return null;
    }

    /**
     * 获取用户公告列表 最新100条
     * @param
     * @return
     */
    @GET
    @Path("/codes/list")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public List<Notice> getListByCodes(){
        User currentUser = userService.getCurrentUser();
        if(currentUser!=null){
            return noticeService.findTop100ByCodes();
        }
        return null;
    }

    /**
     * 添加公告
     */
    @POST
    @Path("/addorg")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public Notice addNotice(Notice notice){
        UserAdmin currentUser = userAdminService.getCurrentAdminUser();
        // 判断是否为管理员用户
        if(currentUser!=null){
            noticeService.addNotice(notice);
            return notice;
        }
        return null;
    }

    /**
     * 平台管理员添加公告，组织机构需要递归获取全部的子机构
     */
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public Notice add(Notice notice) {
        try {
            UserAdmin currentUser = userAdminService.getCurrentAdminUser();
            // 判断是否为管理员用户
            if(currentUser!=null){
                noticeService.addNoticeRoot(notice);
                return notice;
            }
            return null;
        } catch (Exception e) {
            throw new ResourceNotFoundException(Notice.class.getName(), e.getMessage(), e.getCause());
        }
    }

    @POST
    @Path("/add")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public String addNoticeRoot(Notice notice){
        noticeService.addNoticeRoot(notice);
        return "success!";
    }

    /**
     * 给在线用户 发送公告
     */
    @POST
    @Path("/send")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public String sendNotice(@QueryParam("id") String id){
        UserAdmin currentUser = userAdminService.getCurrentAdminUser();
        // 判断是否为管理员用户
        if(currentUser!=null){
            noticeService.sendNotice(id);
            return "success";
        }
        return "";
    }

    /**
     * 查询公告
     */
    @POST
    @Path("/select")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public List<Notice> selectNotice(@QueryParam("scope") int scope,
                                     @QueryParam("code") int code){
        return null;
    }

    /**
     * 获取未查看的公告
     * @param
     * @return
     */
    @GET
    @Path("/unread")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public Notice getAll(@QueryParam("id") String readId){
        User currentUser = userService.getCurrentUser();
        if(currentUser!=null){
            String username = secService.currentUsername();
            User u = userRepo.findByUsername(username);
            return noticeService.findUnreadNotice(readId, u.getGroupCode(), u.getGroupRootCode());
        }
        return null;
    }

}
