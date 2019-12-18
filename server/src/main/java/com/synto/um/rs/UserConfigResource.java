package com.synto.um.rs;

import com.synto.core.jpa.SyntoRepository;
import com.synto.core.rs.SyntoEntityRest;
import com.synto.um.model.User;
import com.synto.um.model.UserConfig;
import com.synto.um.repository.UserConfigRepository;
import com.synto.um.service.UserConfigService;
import com.synto.um.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.Map;

/**
 * 用户设置信息管理
 */
@Slf4j
@Component
@Path("/userconfig")
public class UserConfigResource extends SyntoEntityRest<UserConfig> {

    @Autowired
    UserConfigRepository userConfigRepository;
    @Autowired
    UserConfigService service;
    @Autowired
    UserService userService;
    @Override
    public SyntoRepository<UserConfig> getRepo() {
        return userConfigRepository;
    }

    /**
     * 是否将聊天记录保存至服务端
     * @param user
     * @return
     */
    @POST
    @Path("/save")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> save(UserConfig user) {
        User currentUser = userService.getCurrentUser();
        if(currentUser!=null){
            int tag = service.save(user);
            Map<String, Object> map = new HashMap<>();
            map.put("code", tag);
            map.put("msg", "");
            return map;
        }
        return null;
    }
}
