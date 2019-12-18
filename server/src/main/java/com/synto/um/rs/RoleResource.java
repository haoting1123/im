package com.synto.um.rs;

import com.synto.core.rs.SyntoEntityRest;
import com.synto.um.model.Role;
import com.synto.um.repository.RoleRepository;
import com.synto.um.repository.UserRoleRepository;
import com.synto.um.service.RoleService;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

/**
 * 用户角色信息管理
 */
@Slf4j
@Component
@Path("/role")
public class RoleResource extends SyntoEntityRest<Role> {
    //final static Logger log = LoggerFactory.getLogger(Role.class);

    @Autowired
    RoleRepository roleRepo;

    @Autowired
    RoleService roleService;

    @Autowired
    UserRoleRepository userRoleRepository;

    @Override
    public RoleRepository getRepo() {
        return roleRepo;
    }


    @GET
    @Path("/name/{name}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    @Transactional
    public Role getRole(@PathParam("name") String roleName){

        Role  r = roleRepo.findByName(roleName);
        log.info("find role " + roleName , r);
        return r;
    }

    @GET
    @Path("/code/{code}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    @Transactional
    public Role getRoleByCode(@PathParam("code")String code){
        Role role = roleService.getRoleByCode(code);
        return role;
    }

}
