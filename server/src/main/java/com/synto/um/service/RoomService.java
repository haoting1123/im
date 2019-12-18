package com.synto.um.service;

import com.synto.um.model.vo.MemberVO;
import com.synto.um.model.vo.RoomVO;
import com.synto.um.query.*;
import com.synto.um.query.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoomService {

    @Autowired
    OfPropertyQuery ofPropertyQuery;
    @Autowired
    OfMUCMemberQuery ofMUCMemberQuery;
    @Autowired
    OfMUCAffiliationQuery ofMUCAffiliationQuery;
    @Autowired
    OfMUCRoomQuery ofMUCRoomQuery;
    @Autowired
    OfVcardQuery ofVcardQuery;

    public List<RoomVO> findRoomByUsername(String username){
        List<RoomVO> roomVoList = new ArrayList<>();
        OfProperty ofProperty = ofPropertyQuery.findFirstByName("xmpp.domain");
        if (ofProperty==null){ofProperty=new OfProperty();}
        String userJid = username + "@" + ofProperty.getPropValue();

        List<Long> roomMemberList = ofMUCMemberQuery.findByJid(userJid);
        List<Long> roomAffilList = ofMUCAffiliationQuery.findByJid(userJid);
        roomMemberList.addAll(roomAffilList);

        for (Long roomId : roomMemberList) {
            OfMUCRoom room = ofMUCRoomQuery.findByRoomId(roomId);
            if(room == null){
                continue;
            }
            RoomVO roomVO = findRoomByRoomId(ofProperty.getPropValue(), room);
            roomVoList.add(roomVO);
        }
        return roomVoList;
    }

    public RoomVO findRoomByRoomJid(String roomJid){
        OfProperty ofProperty = ofPropertyQuery.findFirstByName("xmpp.domain");
        OfMUCRoom room = ofMUCRoomQuery.findByName(roomJid.split("@")[0]);
        if(room == null){
            return null;
        }
        return findRoomByRoomId(ofProperty.getPropValue(), room);
    }

    public RoomVO findRoomByRoomId(String xmppDomain, OfMUCRoom room){
        List<OfMUCMember> memberJidList = ofMUCMemberQuery.findByRoomId(room.getRoomID());
        List<OfMUCAffiliation> affList = ofMUCAffiliationQuery.findByRoomId(room.getRoomID());
        List<MemberVO> memberList = new ArrayList<>();
        for (OfMUCMember item : memberJidList) {
            MemberVO vo = new MemberVO();
            vo.setAffiliation("member");
            vo.setJid(item.getJid());
            vo.setNickname(item.getNickname());
            OfVcard vcard = ofVcardQuery.findFirstByUsername(item.getJid().split("@")[0]);
            vo.setVcard(vcard == null ? null : vcard.getVcard());
            memberList.add(vo);
        }
        for (OfMUCAffiliation ofMUCAffiliation : affList) {
            MemberVO vo = new MemberVO();
            if(ofMUCAffiliation.getAffiliation() == 10){
                vo.setAffiliation("owner");
            }else if(ofMUCAffiliation.getAffiliation() == 20){
                vo.setAffiliation("admin");
            }else{
                vo.setAffiliation("none");
            }
            vo.setNickname(ofMUCAffiliation.getNickname());
            vo.setJid(ofMUCAffiliation.getJid());
            OfVcard vcard = ofVcardQuery.findFirstByUsername(ofMUCAffiliation.getJid().split("@")[0]);
            vo.setVcard(vcard == null ? null : vcard.getVcard());
            memberList.add(vo);
        }
        RoomVO roomVO = new RoomVO();
        roomVO.setMemberList(memberList);
        roomVO.setRoomJid(room.getName() + "@conference." + xmppDomain);
        roomVO.setName(room.getNaturalName());
        return roomVO;
    }

    public int updateRoomNaturalName(String roomJid, String newName){
        return ofMUCRoomQuery.updateNaturalNameByName(roomJid.split("@")[0], newName);
    }

    public int updateRoomMemberNickname(String roomJid, String userJid, String nickname){
        OfMUCRoom room = ofMUCRoomQuery.findByName(roomJid.split("@")[0]);
        int count = ofMUCMemberQuery.updateNicknameByJidAndRoomId(room.getRoomID(), userJid, nickname);
        if(count == 0){
            count = ofMUCAffiliationQuery.updateNicknameByJidAndRoomId(room.getRoomID(), userJid, nickname);
        }
        return count;
    }

}
