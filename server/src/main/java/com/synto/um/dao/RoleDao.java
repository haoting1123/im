package com.synto.um.dao;

import com.synto.um.model.Role;
import com.synto.um.redis.RoleRedis;
import com.synto.um.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleDao {

    @Autowired
    RoleRepository roleRepository;

//    @Autowired
//    RoleRedis roleRedis;

    public Role getRoleByCode(String code){
//        Role role = roleRedis.getRoleByCode(code);
//        if (role!=null){
//            return role;
//        }
        Role roleByMySQL = roleRepository.findByCode(code);
//        roleRedis.setRole(roleByMySQL);
        return roleByMySQL;
    }
}
