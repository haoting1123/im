package com.synto.um.admin.service;

import com.synto.core.security.rs.UserInfo;
import com.synto.core.security.service.UserDetailService;
import com.synto.crypto.util.HashUtil;
import com.synto.um.admin.model.SystemAdminLog;
import com.synto.um.admin.model.UserAdmin;
import com.synto.um.admin.repository.SystemAdminLogRepository;
import com.synto.um.admin.repository.UserAdminRepository;
import com.synto.um.model.Group;
import com.synto.um.model.User;
import com.synto.um.repository.GroupRepository;
import com.synto.util.UserUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class UserAdminService implements UserDetailService {

    @Autowired
    UserAdminRepository userAdminRepository;

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    SystemAdminLogRepository systemAdminLogRepository;

    @Override
    public UserInfo findUser(String username) throws RuntimeException {
        UserAdmin userAdmin = userAdminRepository.findFirstByUsername(username);
        if(userAdmin!=null) {
            UserInfo info = new UserInfo();
            //info.setName(u.getNickname());
            info.setPassword(userAdmin.getPlainPassword());
            //info.setSalt(u.getSalt());
            //info.setUid(u.getId());
            info.setUsername(userAdmin.getUsername());
            info.setGroupCode(userAdmin.getGroupCode());
            return info;
        }
        throw new RuntimeException(username+"不存在");
    }

    @Override
    public UserAdmin findUserAdminMessage(String username) {
        UserAdmin userAdmin = userAdminRepository.findFirstByUsername(username);
        if(userAdmin == null){
            return null;
        }
        // 去掉密码等敏感信息
        UserUtils.filterInfo(userAdmin);

        String groupCode = userAdmin.getGroupCode();
        List<Group> group = groupRepository.findByCode(groupCode);
        if (group.size()>0) {
            userAdmin.setGroupName(group.get(0).getGroupName());
        }
        SystemAdminLog login=new SystemAdminLog();
        BeanUtils.copyProperties(userAdmin,login);
        login.setOperation("登录操作");
        login.setGroupRootCode(userAdmin.getGroupCode());
        systemAdminLogRepository.save(login);
        return userAdmin;
    }

    @Override
    public void logout(UserInfo userInfo) {
        String username = userInfo.getUsername();
        if (username==null){
            return;
        }
        UserAdmin userAdmin = userAdminRepository.findFirstByUsername(username);
        if (userAdmin!=null){
            String groupCode = userAdmin.getGroupCode();
        }
        SystemAdminLog login=new SystemAdminLog();
        BeanUtils.copyProperties(userAdmin,login);
        login.setGroupRootCode(userAdmin.getGroupCode());
        login.setOperation("登出操作");
        systemAdminLogRepository.save(login);
    }

    public UserAdmin update(UserAdmin user) {

        Optional<UserAdmin> optionalUser = userAdminRepository.findById(user.getId());
        if(!optionalUser.isPresent()){
            return null;
        }
        UserAdmin u = optionalUser.get();
        if(!user.getPlainPassword().equals(u.getPlainPassword())){
            user.setPlainPassword(HashUtil.hash(user.getPlainPassword()));
        }
        return userAdminRepository.save(user);
    }

    /**
     * 删除管理员
     * @param username
     * @return
     */
    public int deleteAdmin(String username){
        log.info("（＾∀＾●）ﾉｼ com.synto.um.admin.service.UserAdminService：deleteAdmin方法");
        UserAdmin ua = userAdminRepository.findFirstByUsername(username);
        if(ua != null){
            userAdminRepository.delete(ua);
        }
        return 1;
    }

    /**
     * 获取当前登录的管理员用户
     * @return
     */
    public UserAdmin getCurrentAdminUser(){
        Subject currentUser = SecurityUtils.getSubject();
        // 当前登录人信息
        String username = (String) currentUser.getPrincipal();
        UserAdmin userAdmin  = userAdminRepository.findByUsername(username);
        return userAdmin;
    }
}
