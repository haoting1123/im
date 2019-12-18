package com.synto.um.redis;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.synto.core.redis.RedisService;
import com.synto.core.util.JsonUtil;
import com.synto.core.util.RedisUtil;
import com.synto.um.model.Group;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupRedis {

    @Autowired
    RedisService redisService;

    //保存parentCode和code的对应关系，在DB2中，key为parentCode
    public void setChildrenCode(String code,List<String>children){
        RedisService redisServiceDB2 = RedisUtil.changeDB(1, this.redisService);
        redisServiceDB2.setValue(code,children);
    }

    //保存group对象，到DB0中，key为code
    public void setGroup(Group group) {
        String code = group.getCode();
        String message = JsonUtil.toString(group);
        RedisService redisServiceDB0 = RedisUtil.changeDB(0, this.redisService);
        redisServiceDB0.setValue(code,message);
    }

    //DB0中，通过code得到group
    public Group getByCode(String code) {
        RedisService redisServiceDB0 = RedisUtil.changeDB(0, this.redisService);
        String message = (String) redisServiceDB0.getValue(code);
        if (message==null){
            return null;
        }
        return JsonUtil.toObejct(message, Group.class);
    }

    //获取DB2中的parentCode与code的对应关系
    public List<String> getByCodesByParent(String parentCode){
        RedisService redisServiceDB2 = RedisUtil.changeDB(1, this.redisService);
        List<String> childrenCode = (List<String>) redisServiceDB2.getValue(parentCode);
        return childrenCode;
    }


}
