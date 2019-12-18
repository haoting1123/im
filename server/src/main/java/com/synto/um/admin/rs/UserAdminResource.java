package com.synto.um.admin.rs;

import com.synto.core.rs.ResourceNotFoundException;
import com.synto.core.rs.SyntoEntityRest;
import com.synto.crypto.util.HashUtil;
import com.synto.um.admin.model.UserAdmin;
import com.synto.um.admin.repository.UserAdminRepository;
import com.synto.um.admin.service.UserAdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
@Path("/useradmin")
public class UserAdminResource extends SyntoEntityRest<UserAdmin> {
    //final static Logger log = LoggerFactory.getLogger(UserAdminResource.class);

    @Autowired
    UserAdminRepository userAdminRepository;

    @Autowired
    UserAdminService userAdminService;

    @Override
    public UserAdminRepository getRepo() {
        return userAdminRepository;
    }

    @PUT
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    @Override
    public UserAdmin update(@PathParam("id") Long id, UserAdmin entity) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.admin.rs.UserAdminResource：update方法");
        try {
            entity.setId(id);
            return userAdminService.update(entity);

        } catch (Exception e) {
            log.error("update",e);
            throw new ResourceNotFoundException(UserAdmin.class.getName(), e.getMessage(), e.getCause());
        }
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    @Override
    public UserAdmin add(UserAdmin entity) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.admin.rs.UserAdminResource：add方法");
        try {
            UserAdmin userAdmin = getRepo().findFirstByUsername(entity.getUsername());
            if(userAdmin != null && entity.getId() == null){
                return userAdmin;
            }
            entity.setPlainPassword(HashUtil.hash(entity.getPlainPassword()));
            return getRepo().save(entity);
        } catch (Exception e) {
            log.error("add " + entity, e);
            throw new ResourceNotFoundException("UserAdmin", e.getMessage(), e.getCause());
        }
    }


    @GET
    @Path("/groupcode/{groupcode}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public List<UserAdmin> getByGroupCode(@PathParam("groupcode") String groupcode) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.admin.rs.UserAdminResource：getByGroupCode方法");
        return userAdminRepository.findByGroupCode(groupcode);
    }

    @GET
    @Path("/count/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public int userExist(@PathParam("username") String username) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.admin.rs.UserAdminResource：userExist方法");
        return userAdminRepository.countByUsername(username);
    }

    @GET
    @Path("/resetpassword/{groupcode}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public void resetPassword( @PathParam("groupcode") String groupCode){
         log.info("（＾∀＾●）ﾉｼ com.synto.um.admin.rs.UserAdminResource：resetPassword方法");
         userAdminRepository.resetPassword(HashUtil.hash("111111"),groupCode);
    }

    //校验原密码是否正确
    @GET
    @Path("/validata")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public Optional<UserAdmin> getByGroupCode(@QueryParam("id") String id, @QueryParam("oldPwd") String oldPwd) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.admin.rs.UserAdminResource：getByGroupCode方法");
        Optional<UserAdmin> userAdmin = userAdminRepository.findById(Long.valueOf(id));
        if(userAdmin.get().getPlainPassword().equals(HashUtil.hash(oldPwd))){
            return userAdmin;
        }
        return null;
    }

//  根据组织机构代码删除管理员
    public void deleteByGroupCode(String groupcode){

    }

}
