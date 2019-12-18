package com.synto.um.rs;

import com.synto.core.jpa.SyntoRepository;
import com.synto.core.rs.SyntoEntityRest;
import com.synto.um.model.RoomNotice;
import com.synto.um.model.User;
import com.synto.um.repository.RoomNoticeRepository;
import com.synto.um.service.RoomNoticeService;
import com.synto.um.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * 群公告信息管理
 */
@Slf4j
@Component
@Path("/roomnotice")
public class RoomNoticeResource extends SyntoEntityRest<RoomNotice> {

    @Autowired
    RoomNoticeRepository roomNoticeRepository;

    @Autowired
    RoomNoticeService roomNoticeService;

    @Autowired
    UserService userService;

    @Override
    public SyntoRepository<RoomNotice> getRepo() {
        return roomNoticeRepository;
    }

    @POST
    @Path("/select")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public Page<RoomNotice> selectBy(@QueryParam("roomJid") String roomJid,
                                     @QueryParam("page") int page,
                                     @QueryParam("size") int size){
        // 判断是否为普通用户
        User currentUser = userService.getCurrentUser();
        if(currentUser!=null){
            return roomNoticeService.select(roomJid,page,size);
        }
        return null;
    }
}
