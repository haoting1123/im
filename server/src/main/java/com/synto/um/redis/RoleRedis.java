package com.synto.um.redis;

import com.synto.core.redis.RedisService;
import com.synto.core.util.JsonUtil;
import com.synto.core.util.RedisUtil;
import com.synto.um.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleRedis {

    @Autowired
    RedisService redisService;

    public Role getRoleByCode(String code){
        RedisService redisServiceDB3 = RedisUtil.changeDB(3, this.redisService);
        String message = (String) redisServiceDB3.getValue(code);
        if (message==null){
            return null;
        }
        return JsonUtil.toObejct(message,Role.class);
    }

    public void setRole(Role role){
        RedisService redisServiceDB3 = RedisUtil.changeDB(3, this.redisService);
        String code = role.getCode();
        String message = JsonUtil.toString(role);
        redisServiceDB3.setValue(code,message);
    }
}
