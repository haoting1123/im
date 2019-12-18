package com.synto.um.redis;

import com.synto.core.redis.RedisService;
import com.synto.core.util.JsonUtil;
import com.synto.core.util.RedisUtil;
import com.synto.um.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserRedis {
    @Autowired
    RedisService redisService;

    //保存user对象，到DB2中，key为code
    public void setUser(User user) {
        String username =user.getUsername();
        String message = JsonUtil.toString(user);
        RedisService redisServiceDB1 = RedisUtil.changeDB(2, this.redisService);
        redisServiceDB1.setValue(username,message);
    }

    //DB2中，通过code得到group
    public User getByUserName(String userName) {
        RedisService redisServiceDB1 = RedisUtil.changeDB(2, this.redisService);
        String message = (String) redisServiceDB1.getValue(userName);
        if (message==null){
            return null;
        }
        return JsonUtil.toObejct(message, User.class);
    }
}
