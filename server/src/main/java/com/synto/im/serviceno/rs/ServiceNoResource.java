package com.synto.im.serviceno.rs;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.synto.core.jpa.QueryUtil;
import com.synto.core.jpa.SyntoRepository;
import com.synto.core.rs.RequestUtil;
import com.synto.core.rs.ResourceNotFoundException;
import com.synto.core.rs.SyntoEntityRest;
import com.synto.im.serviceno.model.ServiceNo;
import com.synto.im.serviceno.model.ServiceNoArticle;
import com.synto.im.serviceno.model.ServiceNoUser;
import com.synto.im.serviceno.repository.ServiceNoArticleRepository;
import com.synto.im.serviceno.repository.ServiceNoRepository;
import com.synto.im.serviceno.repository.ServiceNoUserRepository;
import com.synto.im.serviceno.service.ServiceNoService;
import com.synto.um.repository.GroupRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@Path("/serviceno")
public class ServiceNoResource extends SyntoEntityRest<ServiceNo> {

    @Autowired
    ServiceNoRepository repository;
    @Autowired
    ServiceNoArticleRepository serviceNoArticleRepository;
    @Autowired
    ServiceNoUserRepository serviceNoUserRepository;
    @Autowired
    ServiceNoService service;
    @Autowired
    GroupRepository groupRepository;

    @Override
    public SyntoRepository<ServiceNo> getRepo() {
        return repository;
    }

    /**
     * 获取该组织机构下的服务号列表
     * @param gcode
     * @return
     */
    @GET
    @Path("/gcode/{gcode}/listall")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public List<ServiceNo> getServiceNoAllByGcode(@PathParam("gcode") String gcode) {
        log.info("（＾∀＾●）ﾉｼ com.synto.im.serviceno.rs.ServiceNoResource：getServiceNoAllByGcode方法");
        return repository.findByGroupRootCode(gcode);
    }

    /**
     * 获取该组织机构下该用户的服务号列表
     * @param gcode
     * @param username
     * @return
     */
    @GET
    @Path("/gcode/{gcode}/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public List<ServiceNo> getServiceNoByGcode(@PathParam("gcode") String gcode, @PathParam("username") String username) {
        log.info("（＾∀＾●）ﾉｼ com.synto.im.serviceno.rs.ServiceNoResource：getServiceNoByGcode方法");
        if(!groupRepository.findByCode(gcode).get(0).getServiceLicense().equals("y")){
            return new ArrayList<>();
        }
        return repository.findByGroupRootCodeAndUsername(gcode, username);
    }

    /**
     * 获取该服务号下的文章列表
     * @param scode
     * @return
     */
    @GET
    @Path("/scode/{scode}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public List<ServiceNoArticle> getServiceNoArticleByScode(@PathParam("scode") String scode) {
        log.info("（＾∀＾●）ﾉｼ com.synto.im.serviceno.rs.ServiceNoResource：getServiceNoArticleByScode方法");
        return serviceNoArticleRepository.findByServiceCode(scode);
    }

    /**
     * 分页获取 文章列表
     * @param page
     * @param size
     * @param gcode
     * @param title
     * @return
     */
    @GET
    @Path("/gcode/{gcode}/article")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public Page<ServiceNoArticle> articleList(@DefaultValue("0") @QueryParam("page") int page,
                                              @DefaultValue("10") @QueryParam("size") int size,
                                              @PathParam("gcode") String gcode,
                                              @QueryParam("title") String title) {
        log.info("（＾∀＾●）ﾉｼ com.synto.im.serviceno.rs.ServiceNoResource：articleList方法");
        Page<ServiceNoArticle> p = service.articleList(page, size, gcode, title);
        return p;
    }

    /**
     * 添加服务号
     * @param serviceNo
     * @return
     */
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    @Override
    public ServiceNo add(ServiceNo serviceNo) {
        log.info("（＾∀＾●）ﾉｼ com.synto.im.serviceno.rs.ServiceNoResource：add方法");
        long id = service.save(serviceNo);
        if(id > 0){
            serviceNo.setId(id);
            return serviceNo;
        }
        return null;
    }

    /**
     * 添加文章
     * @param serviceNoArticle
     * @return
     */
    @POST
    @Path("/article")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public ServiceNoArticle addArticle(ServiceNoArticle serviceNoArticle) {
        log.info("（＾∀＾●）ﾉｼ com.synto.im.serviceno.rs.ServiceNoResource：addArticle方法");
        return serviceNoArticleRepository.save(serviceNoArticle);
    }

    /**
     * 删除文章
     * @param id
     * @return
     */
    @DELETE
    @Path("/article/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public int addArticle(@PathParam("id") Long id) {
        log.info("（＾∀＾●）ﾉｼ com.synto.im.serviceno.rs.ServiceNoResource：addArticle方法");
        serviceNoArticleRepository.deleteById(id);
        return 1;
    }

    /**
     *
     * @param scode
     * @return
     */
    @GET
    @Path("/scode/{scode}/user")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public List<ServiceNoUser> getServiceNoUserByScode(@PathParam("scode") String scode) {
        log.info("（＾∀＾●）ﾉｼ com.synto.im.serviceno.rs.ServiceNoResource：getServiceNoUserByScode方法");
        return serviceNoUserRepository.findByServiceCode(scode);
    }

    /**
     * 保存用户
     * @param data
     * @param tmp
     * @return
     */
    @POST
    @Path("/user")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public int savaUser(@RequestParam String data, @QueryParam("tmp") String tmp){
        log.info("（＾∀＾●）ﾉｼ com.synto.im.serviceno.rs.ServiceNoResource：savaUser方法");
        JSONObject json = JSON.parseObject(data);
        String serviceCode = json.getString("serviceCode");
        List<String> programCode = json.getJSONArray("usernames").toJavaList(String.class);
        return service.savaUser(serviceCode, programCode);
    }

}
