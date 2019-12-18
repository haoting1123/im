package com.synto.um.rs;

import com.synto.core.rs.ResourceNotFoundException;
import com.synto.core.rs.SyntoEntityRest;
import com.synto.um.admin.model.UserAdmin;
import com.synto.um.admin.service.UserAdminService;
import com.synto.um.model.User;
import com.synto.um.model.vo.UserStorageVO;
import com.synto.um.model.vo.UserVO;
import com.synto.um.repository.UserRepository;
import com.synto.um.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 用户信息管理
 */
@Slf4j
@Component
@Path("/user")
public class UserResource extends SyntoEntityRest<User> {
    //final static Logger log = LoggerFactory.getLogger(UserResource.class);

    @Autowired
    UserRepository userRepo;

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserAdminService userAdminService;

    @Override
    public UserRepository getRepo() {
        return userRepo;
    }

    /**
     * 得到所有user 分页 模糊查询
     *
     * @return
     */
    @GET
    @Path("/get")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public Page<User> getAllUser(@QueryParam("page") int page,
                                 @QueryParam("size") int size,
                                 @QueryParam("userName") String userName,
                                 @QueryParam("rootGroupCode") String rootGroupCode) {
        // 获取当前管理员
        UserAdmin userAdmin = userAdminService.getCurrentAdminUser();

        if(userAdmin!=null&&userAdmin.getRoleType().equals("admin")){
            Sort sort = new Sort(Sort.Direction.DESC, "createDate");
            Pageable pageRequest = PageRequest.of(page - 1, size, sort);
            Page<User> list = null;
            if (StringUtils.isNotBlank(rootGroupCode)&&StringUtils.isNotBlank(userName)) {
                list = userRepository.findByGroupRootCodeAndUsernameLike(rootGroupCode,"%"+userName+"%",pageRequest);
            }else if (StringUtils.isNotBlank(rootGroupCode)) {
                list = userRepo.findByGroupRootCode(rootGroupCode, pageRequest);
            }
            list = userService.getAllUser(list);
            return list;
        }
        return null;
    }

    /**
     * 模糊查询组织机构成员
     * @param key
     * @return
     */
    @GET
    @Path("/search")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public List<UserVO> findByLikeName(@QueryParam("key") String key, @QueryParam("groupRootCode") String groupRootCode){
        User currentUser = userService.getCurrentUser();
        if(currentUser!=null){
            return userService.searchByName(key, groupRootCode);
        }
        return null;
    }

    @GET
    @Path("/username/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public User getRole(@PathParam("username") String username) {
        return userRepo.findByUsername(username);
    }

    /**
     * 获取成员信息(组织结构)
     * @param username
     * @return
     */
    @GET
    @Path("/username/{username}/vo")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public UserVO getUserVo(@PathParam("username") String username) {

        return userService.findUserInfo(username);
    }

    /**
     * 查询该用户 存储的消息条数和已经上传的文件大小
     * @param
     * @return
     */
    @GET
    @Path("/storage")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public UserStorageVO getUserStorageVo() {
        // 获取当前普通用户
        User user = userService.getCurrentUser();
        if(user!=null){
            return userService.findUserStorageInfo(user.getUsername());
        }
        return null;
    }

    /**
     * 清除文件释放空间
     * @return
     */
    @PUT
    @Path("/storage/cleanfile")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public int cleanFileSize() {
        // 获取当前普通用户
        User user = userService.getCurrentUser();
        if(user!=null){
            return userService.cleanFile(user.getUsername());
        }
        return 0;
    }

    /**
     * 清除消息释放空间
     * @return
     */
    @PUT
    @Path("/storage/cleanmsg")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public int cleanMsgSize() {
        // 获取当前普通用户
        User user = userService.getCurrentUser();
        if(user!=null){
            return userService.cleanMsg(user.getUsername());
        }
        return 0;
    }


    /**
     * 添加普通用户
     * @param user
     * @return
     */
    @POST
    @Path("/save")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> save(User user) {
        // 获取当前管理员
        UserAdmin userAdmin = userAdminService.getCurrentAdminUser();
        if(userAdmin!=null&&userAdmin.getRoleType().equals("admin")){
            int tag = userService.save(user);
            Map<String, Object> map = new HashMap<>();
            map.put("code", tag);
            map.put("msg", "");
            return map;
        }
        return null;
    }

    /**
     * 获取当前普通用户名数量
     * @param username
     * @return
     */
    @GET
    @Path("/count/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public int userExist(@PathParam("username") String username) {
        // 获取当前管理员
        UserAdmin userAdmin = userAdminService.getCurrentAdminUser();
        int num=0;
        if(userAdmin!=null&&userAdmin.getRoleType().equals("admin")){
            return userRepo.countByUsername(username);
        }
        return num;
    }


    /**
     * 前端没用该方法
     * @param groupcode
     * @return
     */
    @GET
    @Path("/select/{groupcode}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public List<User> getByGroupCode(@PathParam("groupcode") String groupcode) {
        return userRepo.findByGroupCode(groupcode);
    }

    /**
     * 管理员重置普通用户密码
     * @param user
     * @return
     */
    @PUT
    @Path("/resetpwd")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public int resetPassword(User user){
        UserAdmin userAdmin = userAdminService.getCurrentAdminUser();
        int num=0;
        if(userAdmin!=null&&userAdmin.getRoleType().equals("admin")){
            num = userService.resetPassword(user);
        }
        return num;
    }

    /**
     * 修改普通用户
     * @param id
     * @param entity
     * @return
     */
    @PUT
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    @Override
    public User update(@PathParam("id") Long id, User entity) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.UserResource：update方法 用户信息为：" + entity.toString());
        try {
            // 获取当前用户
//            User currentUser = userService.getCurrentUser();
            entity.setId(id);
            return userService.update(entity);
//            return null;
        } catch (Exception e) {
            log.error("update",e);
            throw new ResourceNotFoundException(User.class.getName(), e.getMessage(), e.getCause());
        }
    }
    /**
     * 修改密码
     * @param user
     * @return
     */
    @PUT
    @Path("/changepwd")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public int changePassword(User user){
        // 获取当前用户
        User currentUser = userService.getCurrentUser();
        int num = 0;
        if(currentUser.getUsername().equals(user.getUsername())){
            return userService.changePassword(user);
        }
        return num;
    }

    /**
     * 修改性别和昵称
     */
    @PUT
    @Path("/sexname")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public int changeSexAndName(User user){
        User currentUser = userService.getCurrentUser();
        int num =0;
        if(currentUser.getUsername().equals(user.getUsername())){
            num = userService.updateSexAndName(user);
        }
        return num;
    }
}
