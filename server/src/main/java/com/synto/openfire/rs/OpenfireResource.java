//package com.synto.openfire.rs;
//
//import com.alibaba.fastjson.JSON;
//import com.synto.core.rs.SyntoEntityRest;
//import com.synto.openfire.client.OpenfireClient;
//import com.synto.openfire.service.OpenfireService;
//import com.synto.um.model.User;
//import com.synto.um.repository.UserRepository;
//import com.synto.um.service.UserService;
//import org.igniterealtime.restclient.RestApiClient;
//import org.igniterealtime.restclient.RestClient;
//import org.igniterealtime.restclient.entity.UserEntities;
//import org.igniterealtime.restclient.entity.UserEntity;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.stereotype.Component;
//
//import javax.ws.rs.*;
//import javax.ws.rs.core.MediaType;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//
//@Component
//@Path("/openfire")
//public class OpenfireResource{
//    final static Logger log = LoggerFactory.getLogger(OpenfireResource.class);
//
//    @Autowired
//    OpenfireService openfireService;
//
//    @GET
//    @Path("/users")
//    @Produces(MediaType.APPLICATION_JSON)
//    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
//    public List<UserEntity> getByGroupCode(){
////        RestApiClient restApi = OpenfireClient.getRestApiClient();
////        UserEntities userEntities = restApi.getUsers();
////        List<UserEntity> list = userEntities.getUsers();
//
//        openfireService.sendNotice(1l, "ffffffffffffffffff", "aaaa");
//
//
//        return null;
//    }
//
//}
