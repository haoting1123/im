package com.synto.im.openfire.service;

import com.synto.im.openfire.model.MucOffline;
import com.synto.im.openfire.query.OfMUCConversationLogQuery;
import com.synto.im.openfire.repository.MucOfflineRepository;
import com.synto.um.query.model.OfMUCConversationLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomMessageService {

    @Autowired
    OfMUCConversationLogQuery ofMUCConversationLogQuery;

    @Autowired
    MucOfflineRepository  mucOfflineRepo;
    /**
     * 获取群离线消息
     *
     * @param username
     * @param roomJid
     * @param timestasp
     * @return
     */
//    public List<OfMUCConversationLog> findOffLineMessage( String roomJid, String timestasp){
//        String name = roomJid.split("@")[0];
//        List<OfMUCConversationLog> msgList = ofMUCConversationLogQuery.findByRoomIdAndTime(name, timestasp);
//        return msgList;
//    }
    public List<OfMUCConversationLog> findOffLineMessage(String username, String roomJid, Long timestasp){
        String roomName = roomJid.split("@")[0];

        MucOffline offline = mucOfflineRepo.findByUsernameAndRoom(username, roomName);
        Long first = offline == null || offline.getLast() < timestasp ? timestasp:  offline.getLast();
        List<OfMUCConversationLog> msgList = ofMUCConversationLogQuery.findByRoomIdAndTime(roomName, first);

        if(offline == null){
            offline = new MucOffline();
            offline.setUsername(username);
            offline.setRoom(roomName);
        }
        if(!msgList.isEmpty()) {
            offline.setFirst(timestasp);
            offline.setLast(msgList.get(msgList.size()-1).getLogtime());
            mucOfflineRepo.save(offline);
        }
        return msgList;
    }

}
