package com.synto.core.util;

import com.synto.core.redis.RedisService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;

@Slf4j
public class RedisUtil {

    public static RedisService changeDB(Integer db, RedisService redisService){
        log.info("（＾∀＾●）ﾉｼ com.synto.core.util.RedisUtil：changeDB方法");
        RedisTemplate redisTemplate = redisService.getRedisTemplate();
        JedisConnectionFactory jedisConnectionFactory = (JedisConnectionFactory) redisTemplate.getConnectionFactory();
        jedisConnectionFactory.setDatabase(db);
        redisTemplate.setConnectionFactory(jedisConnectionFactory);
        redisService.setRedisTemplate(redisTemplate);
        return redisService;
    }
}
