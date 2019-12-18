package com.synto.um.rs;

import com.synto.core.jpa.SyntoRepository;
import com.synto.core.rs.SyntoEntityRest;
import com.synto.um.model.ClientVersion;
import com.synto.um.model.User;
import com.synto.um.model.vo.ClientVersionVO;
import com.synto.um.repository.ClientVersionRepository;
import com.synto.um.service.ClientVersionService;
import com.synto.um.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 * 客户端版本管理
 */
@Component
@Path("/sc")
public class ClientVersionResource extends SyntoEntityRest<ClientVersion> {

    @Autowired
    ClientVersionRepository clientVersionRepository;

    @Autowired
    ClientVersionService service;

    @Autowired
    UserService userService;

    @Override
    public SyntoRepository<ClientVersion> getRepo() {
        return clientVersionRepository;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/server/version")
    public String osVersionno() {

        return service.getServer();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{os}/version/no")
    public String osVersionno(@PathParam("os") String os) {
        return service.findVersionNo(os);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{os}/{network}/version/no")
    public String osVersionno(@PathParam("os") String os, @PathParam("network") String network) {
        return service.findVersionNo(os, network);
    }

    /**
     * 根据系统类型获取版本信息
     * @param os
     * @return
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{os}/version")
    public ClientVersionVO osVersion(@PathParam("os") String os) {
        //判断是否为普通用户
        User currentUser = userService.getCurrentUser();
        if(currentUser!=null){
            return service.findVersion(os);
        }
        return null;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{os}/{network}/version")
    public ClientVersionVO osVersion(@PathParam("os") String os, @PathParam("network") String network) {
        return service.findVersion(os, network);
    }


}
