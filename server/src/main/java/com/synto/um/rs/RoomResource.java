package com.synto.um.rs;

import com.synto.um.model.User;
import com.synto.um.model.vo.RoomVO;
import com.synto.um.query.model.OfMUCMember;
import com.synto.um.query.model.OfMUCRoom;
import com.synto.um.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

/**
 * 群信息管理
 */
@Component
@Path("/room")
public class RoomResource {

    @Autowired
    RoomService roomService;
    @Autowired
    UserService  userService;

    @GET
    @Path("/{roomjid}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public RoomVO findRoomInfo(@PathParam("roomjid") String roomJid) {
        User currentUser = userService.getCurrentUser();
        if(currentUser!=null){
            return roomService.findRoomByRoomJid(roomJid);
        }
        return null;
    }

    @PUT
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public int updateRoomName(OfMUCRoom room) {
        return roomService.updateRoomNaturalName(room.getRoomJid(), room.getNaturalName());
    }

    @PUT
    @Path("/member/nickname")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public int updateRoomName(OfMUCMember member) {
        return roomService.updateRoomMemberNickname(member.getRoomJid(), member.getJid(), member.getNickname());
    }

}
