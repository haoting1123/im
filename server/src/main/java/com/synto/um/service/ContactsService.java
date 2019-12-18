package com.synto.um.service;

import com.synto.um.model.Contacts;
import com.synto.um.model.User;
import com.synto.um.query.model.OfVcard;
import com.synto.um.model.vo.ContactsVO;
import com.synto.um.repository.ContactsRepository;
import com.synto.um.query.OfVcardQuery;
import com.synto.um.repository.GroupRepository;
import com.synto.um.repository.UserRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ContactsService {

    @Autowired
    ContactsRepository contactsRepository;

    @Autowired
    UserRepository userRepository;
    @Autowired
    OfVcardQuery ofVcardQuery;
    @Autowired
    UserService userService;

    /**
     * 模糊查询好友
     *
     * @param username
     * @param key
     * @return
     */
    public List<Contacts> fuzzyQuery(String username,String key){
        List<Contacts> byUserName = contactsRepository.findByUserName(username);
        List<Contacts> queryList=new ArrayList<>();
        for (Contacts contact:byUserName){
            String friendJid = contact.getFriendJid();
            if(StringUtils.isBlank(friendJid)){
                continue;
            }
            if (friendJid.contains(key)){
                queryList.add(contact);
            }else if (contact.getAlias()!=null){
                if (contact.getAlias().contains(key)) {
                    queryList.add(contact);
                }
            }
        }
        return queryList;
    }

    /**
     * 获取好友列表和vcard信息
     * @param username
     * @return
     */
    public List<ContactsVO> findFriendByUsername(String username){
        List<Contacts> friendList = contactsRepository.findByUserName(username);
        List<ContactsVO> voList = new ArrayList<>();
        for (Contacts contacts : friendList) {
            String friendJid = contacts.getFriendJid();
            if(friendJid.indexOf("@") > 0){
                friendJid = friendJid.split("@")[0];
            }
            OfVcard ofVcard = ofVcardQuery.findFirstByUsername(friendJid);
            User user = userService.findUserInfo(friendJid);
            if(user == null)
                continue;
            ContactsVO vo = new ContactsVO();
            vo.setId(contacts.getId());
            vo.setAlias(contacts.getAlias());
            vo.setFriendJid(contacts.getFriendJid());
            vo.setUserName(contacts.getUserName());
            vo.setVcard(ofVcard == null ? null : ofVcard.getVcard());
            vo.setGroupCode(user.getGroupCode());
            vo.setGroupName(user.getGroupName());
            voList.add(vo);
        }
        return voList;
    }
}
