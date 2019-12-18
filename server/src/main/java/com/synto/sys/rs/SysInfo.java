package com.synto.sys.rs;

import com.synto.um.admin.model.UserAdmin;
import com.synto.um.admin.repository.UserAdminRepository;
import com.synto.um.model.User;
import com.synto.um.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Slf4j
@Component
@Path("/sys")
public class SysInfo {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserAdminRepository userAdminRepository;

    @GET
    @Path("/info/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public Info getInfo(@PathParam("username") String username){
        log.info("（＾∀＾●）ﾉｼ com.synto.sys.rs.SysInfo：getInfo方法");
        User user = userRepository.findByUsername(username);
        String groupRootCode = user.getGroupRootCode();
        Info info=new Info();
        if (groupRootCode!=null) {
            List<UserAdmin> adminList = userAdminRepository.findByGroupCode(groupRootCode);
            if (adminList != null && adminList.size() > 0) {
                UserAdmin userAdmin = adminList.get(0);
                String telephone = userAdmin.getTelephone();
                if (telephone != null) {
                    info.setPhone(telephone);
                }
            }
        }
        return info;
    }

}
