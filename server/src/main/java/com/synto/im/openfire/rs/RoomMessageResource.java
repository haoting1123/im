package com.synto.im.openfire.rs;

import com.synto.im.openfire.service.RoomMessageService;
import com.synto.um.query.model.OfMUCConversationLog;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Slf4j
@Component
@Path("/muc")
public class RoomMessageResource {

    @Autowired
    RoomMessageService service;

    /**
     * 获取群 离线消息
     * @param roomJid
     * @param timestamp
     * @return
     */
//    @GET
//    @Produces(MediaType.APPLICATION_JSON)
//    @Path("/offlinemessage")
//    public List<OfMUCConversationLog> osVersionno(@QueryParam("roomJid") String roomJid, @QueryParam("timestamp") String timestamp) {
//        return service.findOffLineMessage(roomJid, timestamp);
//    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/offlinemessage")
    public List<OfMUCConversationLog> osVersionno(@QueryParam("username") String username, @QueryParam("roomJid") String roomJid, @QueryParam("timestamp") Long timestamp) {
        log.info("（＾∀＾●）ﾉｼ com.synto.im.openfire.rs.RoomMessageResource：osVersionno方法");
        return service.findOffLineMessage(username, roomJid, timestamp);
    }


}
