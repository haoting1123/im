package com.synto.um.service;

import com.synto.um.model.ClientSetting;
import com.synto.um.model.UserConfig;
import com.synto.um.model.vo.ClientSettingVO;
import com.synto.um.model.vo.MemberVO;
import com.synto.um.model.vo.RoomVO;
import com.synto.um.query.*;
import com.synto.um.query.model.OfMUCAffiliation;
import com.synto.um.query.model.OfMUCRoom;
import com.synto.um.query.model.OfProperty;
import com.synto.um.query.model.OfVcard;
import com.synto.um.repository.ClientSettingRepository;
import com.synto.um.repository.UserConfigRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClientSettingService {

    @Autowired
    OfPropertyQuery ofPropertyQuery;
    @Autowired
    ClientSettingRepository clientSettingRepository;
    @Autowired
    UserConfigRepository userConfigRepository;

    public ClientSettingVO getConfig(String username){
        OfProperty ofProperty = ofPropertyQuery.findFirstByName("xmpp.domain");
        List<ClientSetting> csList = clientSettingRepository.findAll();

        ClientSettingVO vo = new ClientSettingVO();
        if (ofProperty==null){ofProperty=new OfProperty();}
        vo.setXmppDomain(ofProperty.getPropValue());
        if(csList != null && csList.size() > 0){
            ClientSetting setting = csList.get(0);
            BeanUtils.copyProperties(setting, vo);
        }
        UserConfig userConfig = userConfigRepository.findFirstByUsername(username);
        if (userConfig!=null) {
            vo.setChatLogStorage(userConfig.getChatLogStorage());
        }else {
            vo.setChatLogStorage("0");
        }
        vo.setServerTimestamp(System.currentTimeMillis());
        return vo;
    }


}
