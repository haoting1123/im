package com.synto.um.dao;

import com.synto.core.redis.RedisService;
import com.synto.um.model.User;
import com.synto.um.redis.UserRedis;
import com.synto.um.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserDao {

//    @Autowired
//    UserRedis userRedis;

    @Autowired
    UserRepository userRepository;

    public User getUserByUserName(String username){
//        User user = userRedis.getByUserName(username);
//        if (user!=null){
//            return user;
//        }
        User userByMySQL = userRepository.findByUsername(username);
//        userRedis.setUser(userByMySQL);
        return userByMySQL;
    }

}
