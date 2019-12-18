package com.synto.um.dao;

import com.synto.core.redis.RedisService;
import com.synto.um.model.Group;
import com.synto.um.redis.GroupRedis;
import com.synto.um.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupDao {

//    @Autowired
//    RedisService redisService;

//    @Autowired
//    GroupRedis groupRedis;

    @Autowired
    GroupRepository groupRepository;

    public List<Group> getChildren(String code) {
        //从redis查找，如果没有再从mysql查找
//        List<String> childrenCodes = groupRedis.getByCodesByParent(code);
//        //从redis缓存获取
//        if (childrenCodes!=null&&childrenCodes.size()!=0){
//            List<Group> groupList=new ArrayList<>();
//            for (String ccode:childrenCodes){
//                Group child = this.getByCode(ccode);
//                groupList.add(child);
//            }
//            return groupList;
//        }
        //从mysql里取group列表，放入redis
        List<Group> children = groupRepository.findByParentCode(code);
//        children.stream().forEach(child->groupRedis.setGroup(child));
//        //孩子节点里的所有code
//        List<String> childCodes = children.stream().map(Group::getCode).collect(Collectors.toList());
//        groupRedis.setChildrenCode(code,childCodes);
        return children;
    }

    public Group getByCode(String code) {
//        Group group = groupRedis.getByCode(code);
//        if (group!=null){
//            return group;
//        }
        List<Group> groupList = groupRepository.findByCode(code);
//        groupRedis.setGroup(groupList.get(0));
        if(groupList.isEmpty()) {
            return null;
        }
        return groupList.get(0);
    }

    public void saveGroup(Group group) {
//        groupRedis.setGroup(group);
        groupRepository.save(group);
    }

}
