package com.synto.um.rs;

import com.synto.core.redis.RedisConfiguration;
import com.synto.core.redis.RedisService;
import com.synto.um.redis.GroupRedis;
import com.synto.um.repository.GroupRepository;
import com.synto.um.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;


@Component
@Path("/redis")
public class RedisResource {

    @Autowired
    RedisService redisService;

    @Autowired
    RedisConfiguration redisConfiguration;

    @Autowired
    GroupService groupService;

    @Autowired
    GroupRedis groupRedis;

    @Autowired
    GroupRepository groupRepository;

    @GET
    @Path("/test/{groupcode}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public List<String> testRedis(@PathParam("groupcode") String groupcode) {
        return null;
    }
}
