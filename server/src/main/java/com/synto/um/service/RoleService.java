package com.synto.um.service;

import com.synto.um.dao.GroupDao;
import com.synto.um.dao.RoleDao;
import com.synto.um.dao.UserDao;
import com.synto.um.model.Group;
import com.synto.um.model.Role;
import com.synto.um.model.User;
import com.synto.um.repository.UserRepository;
import com.synto.um.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class RoleService {

    @Autowired
    RoleDao roleDao;

    @Autowired
    GroupDao groupDao;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserRoleRepository userRoleRepository;

    /**
     * 查询role时，查出该role下的user和role所属group
     * @param code
     * @return
     */
    public Role getRoleByCode(String code){
        Role role = roleDao.getRoleByCode(code);
        if (role==null){
            return null;
        }
        List<String> userIds = userRoleRepository.getUserIdByRoleCode(code);
        List<User> users=new ArrayList<>();
        if (userIds!=null) {
            for (String id : userIds) {
                long l = Long.parseLong(id);
                User user = userRepository.findById(l).get();
                users.add(user);
            }
        }
        return role;
    }
}
