package com.synto.openfire.service;

import com.alibaba.fastjson.JSON;
import com.synto.openfire.client.OpenfireClient;
import com.synto.um.model.Notice;
import com.synto.um.model.User;
import com.synto.um.query.OfPropertyQuery;
import com.synto.um.query.model.OfProperty;
import com.synto.um.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.igniterealtime.restclient.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class OpenfireService {
    final static Logger logger = LoggerFactory.getLogger(OpenfireService.class);

    @Autowired
    UserRepository userRepo;

    @Autowired
    OpenfireClient openfireClient;

    @Autowired
    OfPropertyQuery ofPropertyQuery;
    /**
     * 给所有人在线人发送公告
     *
     * @param notice
     * @return
     */
    public int sendNotice(Notice notice){
        log.info("（＾∀＾●）ﾉｼ com.synto.openfire.service.OpenfireService：sendNotice方法");
        RestClient client = openfireClient.getRestClient();

        Map<String, Object> map = new HashMap();
        map.put("id", notice.getId());
        map.put("content", notice.getContent());
        map.put("title", notice.getTitle());
        map.put("time", notice.getCreateTime());
        String body = null;

        List<String> usernames = null;
        //发给所有人
        if(org.apache.commons.lang3.StringUtils.isEmpty(notice.getOrganizeInfo())){
            if(!notice.getCodes().equals("-1")) {

            }
        }

        //平台管理员是-1， 发给平台所有人
        if(StringUtils.isEmpty(notice.getOrganizeInfo())){
            if(notice.getCodes().equals("-1")){
                body = "<message><body>" + JSON.toJSONString(map) + "</body></message>";
            } else  {
                //机构管理员，发给本机构的所有人，
                body = "<message><body>" + JSON.toJSONString(map) + "</body>" + jidsByRootCode(notice.getCodes()) + "</message>";
            }
        } else {
            body = "<message><body>" + JSON.toJSONString(map) + "</body>" + jids(notice.getOrganizeInfo()) + "</message>";
        }

        Response response = client.post("messages/users", body, new HashMap<>());
        return response.getStatus();
    }

    private String jidsByRootCode(String rootCode) {
        log.info("（＾∀＾●）ﾉｼ com.synto.openfire.service.OpenfireService：jidsByRootCode方法");
        OfProperty prop = ofPropertyQuery.findFirstByName("xmpp.domain");
        String domain = prop.getPropValue();
        String str = "<jids>";
        for (User user : userRepo.findByGroupRootCode(rootCode)) {
            str += String.format("<jid>%s@%s</jid>", user.getUsername(), domain);
        }
        str += "</jids>";
        return str;
    }


    public String jids(String orgCodes){
        log.info("（＾∀＾●）ﾉｼ com.synto.openfire.service.OpenfireService：jids方法");
        OfProperty prop = ofPropertyQuery.findFirstByName("xmpp.domain");
        String domain = prop.getPropValue();
        String[] codes = orgCodes.split(",");
        String str = "<jids>";
        for(String code:codes) {
            if(StringUtils.isEmpty(code))
                continue;
            List<User> users = userRepo.findByGroupCode(code);
            for(User user: users) {
                str += String.format("<jid>%s@%s</jid>", user.getUsername(), domain);
            }
        }
        str +="</jids>";
        return str;
    }
}
