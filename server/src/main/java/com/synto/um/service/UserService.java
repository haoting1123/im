package com.synto.um.service;

import com.synto.crypto.util.HashUtil;
import com.synto.um.admin.repository.SystemAdminLogRepository;
import com.synto.um.dao.GroupDao;
import com.synto.um.dao.RoleDao;
import com.synto.um.dao.UserDao;
import com.synto.um.model.Group;
import com.synto.um.model.User;
import com.synto.um.model.UserConfig;
import com.synto.um.model.vo.UserStorageVO;
import com.synto.um.model.vo.UserVO;
import com.synto.um.query.OfVcardQuery;
import com.synto.um.query.model.OfVcard;
import com.synto.um.repository.GroupRepository;
import com.synto.um.repository.OfMessageHistoryRepository;
import com.synto.um.repository.UserConfigRepository;
import com.synto.um.repository.UserRepository;
import com.synto.util.DateUtils;
import com.synto.util.OpenfireUtil;
import com.synto.util.UserUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    UserDao userDao;

    @Autowired
    GroupDao groupDao;

    @Autowired
    RoleDao roleDao;

    @Autowired
    UserRepository userRepository;

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    SystemAdminLogRepository systemAdminLogRepository;

    @Autowired
    OfVcardQuery ofVcardQuery;

    @Autowired
    UserConfigRepository userConfigRepository;
    @Autowired
    OfMessageHistoryRepository ofMessageHistoryRepository;

    /**
     * 查询用户，分页带组织名称
     */
    public Page<User> getAllUser(Page<User> list){

        for (User user:list){
            List<Group> gs = groupRepository.findByCode(user.getGroupCode());
            if(!gs.isEmpty()) {
                Group group = gs.get(0);
                if (group != null) {
                    user.setGroupName(group.getGroupName());
                    user.setGroupCode(group.getCode());
                }
            }
            // 去掉密码等敏感信息
            //UserUtils.filterInfo(user);
        }
        return list;
    }

    /**
     * 查询user同时也查询user对应的group和role
     *
     */
    public User getUserByUserName(String userName){
        User user = userDao.getUserByUserName(userName);
        if (user==null){
            return null;
        }
        String groupCode = user.getGroupCode();
        Group group = groupDao.getByCode(groupCode);
        user.setGroup(group);
        /*String roleCode = user.getRoleCode();
        Role role = roleDao.getRoleByCode(roleCode);
        user.setRole(role);*/
        return user;
    }

    /**
     * 模糊查询用户
     * @param name
     * @return
     */
    public List<UserVO> searchByName(String name, String groupRootCode){
        if(StringUtils.isEmpty(name)){
            name = "";
        }
        if(StringUtils.isEmpty(groupRootCode)){
            return new ArrayList<>();
        }
        List<UserVO> voList = new ArrayList<>();
        List<User> list = userRepository.findTop100ByNameContainingAndIdentityAndGroupRootCodeOrUsernameContainingAndIdentityAndGroupRootCode(name, "1", groupRootCode, name, "1", groupRootCode);
        for (User user : list) {
            UserUtils.filterInfo(user);
            UserVO vo = new UserVO();
            BeanUtils.copyProperties(user, vo);
            OfVcard ofVcard = ofVcardQuery.findFirstByUsername(user.getUsername());
            vo.setVcard(ofVcard == null ? null : ofVcard.getVcard());
            voList.add(vo);
        }
        return voList;
    }

    public UserVO findUserInfo(String username){
        User user = userRepository.findByUsername(username);
        if(user == null)
            return null;
        UserUtils.filterInfo(user);
        UserVO vo = new UserVO();
        BeanUtils.copyProperties(user, vo);
        OfVcard ofVcard = ofVcardQuery.findFirstByUsername(username);
        vo.setVcard(ofVcard == null ? null : ofVcard.getVcard());

        String photo = ofVcard == null ? null : UserUtils.getUserPhoto(ofVcard.getVcard());
        if(StringUtils.isNotBlank(photo)){
            vo.setPhoto(photo);
        }

        List<Group> gs = groupRepository.findByCode(user.getGroupCode());
        if(!gs.isEmpty()) {
            Group group = gs.get(0);
            if (group != null) {
                vo.setGroupName(group.getGroupName());
            }
        }
        return vo;
    }

    public int save(User user){
        Long id = user.getId();
        if(id ==null) {
            //第一次创建用户，设置密码
            OpenfireUtil.handlePassword(user);
            user.setCreateDate(DateUtils.time2String(new Date(System.currentTimeMillis())));
            user.setPlainPassword(HashUtil.hash(user.getPlainPassword()));
        }
        user.setModificationDate(DateUtils.time2String(new Date(System.currentTimeMillis())));

        userRepository.save(user);

        if(id == null || id == 0){
            String vcard = "<vCard xmlns=\"vcard-temp\"><name>" + user.getName() + "</name><sex>" + user.getSex() + "</sex><photo></photo></vCard>";
            if(ofVcardQuery.findFirstByUsername(user.getUsername()) != null){
                ofVcardQuery.updateOfVcard(user.getUsername(), vcard);
            }else{
                ofVcardQuery.insertOfVcard(user.getUsername(), vcard);
            }
        }

        return 0;
    }

    /**
     * reset密码
     */
    public int resetPassword(User user){

        Optional<User> optionalUser = userRepository.findById(user.getId());
        if(!optionalUser.isPresent()){
            return 0;
        }

        OpenfireUtil.handlePassword(user);
        user.setPlainPassword(HashUtil.hash(user.getPlainPassword()));
        return userRepository.updatePassword(user.getEncryptedPassword(),user.getStoredKey(),
                user.getServerKey(),user.getSalt(),user.getIterations(),
                user.getPlainPassword(),user.getId());

    }

    /**
     * 修改密码
     */
    public int changePassword(User user){
        if(StringUtils.isEmpty(user.getNewPassword()) || StringUtils.isEmpty(user.getPlainPassword())){
            return 0;
        }

        Optional<User> optionalUser = userRepository.findById(user.getId());
        if(!optionalUser.isPresent()){
            return 0;
        }

        User u = optionalUser.get();
        if(!HashUtil.hash(user.getPlainPassword()).equals(u.getPlainPassword())){
            return 0;
        }

        user.setPlainPassword(user.getNewPassword());
        OpenfireUtil.handlePassword(user);
        user.setPlainPassword(HashUtil.hash(user.getNewPassword()));
        return userRepository.updatePassword(user.getEncryptedPassword(),user.getStoredKey(),
                user.getServerKey(),user.getSalt(),user.getIterations(),
                user.getPlainPassword(),user.getId());

    }

    /**
     * 修改性别和昵称
     */
    public int updateSexAndName(User user){
        Long id = user.getId();
        String sex = user.getSex();
        String name = user.getName();
        return userRepository.updateSexAndName(sex,name,id);
    }

    /**
     * 修改用户信息
     * @param user
     * @return
     */
    public User update(User user) {
        //获得当前时间，作为最后修改时间
        user.setModificationDate(DateUtils.time2String(new Date(System.currentTimeMillis())));
        Optional<User> optionalUser = userRepository.findById(user.getId());
        if(!optionalUser.isPresent()){
            return null;
        }
        User u = optionalUser.get();
        if(!user.getPlainPassword().equals(u.getPlainPassword())){
            OpenfireUtil.handlePassword(user);
            user.setPlainPassword(HashUtil.hash(user.getPlainPassword()));
        }

        if(!u.getName().equals(user.getName()) || !u.getSex().equals(user.getSex())){
            OfVcard ofVcard = ofVcardQuery.findFirstByUsername(user.getUsername());
            String vcard = ofVcard.getVcard().replaceAll("<name>(.*?)</name>", "<name>" + user.getName() + "</name>")
                    .replaceAll("<sex>(.*?)</sex>", "<sex>" + user.getSex() + "</sex>");
            ofVcardQuery.updateOfVcard(user.getUsername(), vcard);
        }

        return userRepository.save(user);
    }

    public UserStorageVO findUserStorageInfo(String username){
        UserConfig uc = userConfigRepository.findFirstByUsername(username);
        long msgNum = ofMessageHistoryRepository.countBySender(username);

        UserStorageVO vo = new UserStorageVO();
        vo.setStorageMsgCount(msgNum);
        if(uc == null){
            vo.setStorageFileUpSize(0d);
        }else{
            vo.setStorageFileUpSize(uc.getStorageFileUpSize());
        }

        return vo;
    }

    public int cleanFile(String username){
        UserConfig uc = userConfigRepository.findFirstByUsername(username);
        uc.setStorageFileUpSize(0d);
        userConfigRepository.save(uc);
        return 1;
    }

    public int cleanMsg(String username){
        ofMessageHistoryRepository.deleteBySender(username);
        return 1;
    }

    /**
     * 获取当前登录的普通用户
     * @return
     */
    public User getCurrentUser(){
        Subject currentUser = SecurityUtils.getSubject();
        // 当前登录人信息
        String username = (String) currentUser.getPrincipal();
        User user  = userRepository.findByUsername(username);
        return user;
    }

}
