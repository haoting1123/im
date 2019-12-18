package com.synto.um.rs;

import com.synto.core.security.rs.UserInfo;
import com.synto.crypto.util.HashUtil;
import com.synto.um.model.User;
import com.synto.um.model.UserLog;
import com.synto.um.model.vo.ClientSettingVO;
import com.synto.um.model.vo.ContactsVO;
import com.synto.um.model.vo.RoomVO;
import com.synto.um.model.vo.UserVO;
import com.synto.um.repository.ClientSettingRepository;
import com.synto.um.repository.UserLogRepository;
import com.synto.um.service.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 用户登录信息
 */
@Slf4j
@Component
@Path("/um")
public class AuthResource {
    @Autowired
    UserService userService;
    @Autowired
    ContactsService contactsService;
    @Autowired
    ClientSettingRepository clientSettingRepository;
    @Autowired
    RoomService roomService;
    @Autowired
    ClientSettingService clientSettingService;
    @Autowired
    UserLogService userLogService;
    @Autowired
    UserLogRepository userLogRepository;

    @POST
    @Path("/login")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Map login(UserInfo info) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.AuthResource: login方法");
        Map m = new HashMap();

        UsernamePasswordToken token = new UsernamePasswordToken(info.getUsername(), HashUtil.hash(info.getPassword()).toCharArray());
        Subject currentUser = SecurityUtils.getSubject();
        try {
            currentUser.login(token);

            m.put("code", 0);
            m.put("token", "tmp-sldkjslksss"+new Date().getTime());

            // 当前登录人信息
            String username = (String) currentUser.getPrincipal();
            UserVO user = userService.findUserInfo(username);
//            //TODO 标识和状态未添加
//            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            // 好友列表
            List<ContactsVO> friendList = contactsService.findFriendByUsername(username);
            // 群列表
            List<RoomVO> roomList = roomService.findRoomByUsername(username);
            // 配置信息
            ClientSettingVO clientSettingVO = clientSettingService.getConfig(username);

            log(info,"用户登录！","上线！");

            Map data = new HashMap();
            data.put("friends", friendList);
            data.put("rooms", roomList);
            data.put("config", clientSettingVO);
            data.put("userinfo", user);
            data.put("sessionID", currentUser.getSession().getId());

            m.put("data",data);
        } catch (UnknownAccountException e) {
            log.info("UnknownAccountException -- > 账号不存在：",e);
            m.put("code",404);
            m.put("data"," 账号不存在");
        } catch (IncorrectCredentialsException e) {
            log.info("IncorrectCredentialsException -- > 密码不正确：",e);
            m.put("data"," 密码不正确");
            m.put("code",401);
        } catch (Exception e){
            e.printStackTrace();
            log.info("IncorrectCredentialsException -- > 密码不正确：",e);
            m.put("data"," 账号或密码不正确");
            m.put("code",402);
        }
        return m;
    }

    @POST
    @Path("/logout")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Map logout(UserInfo info) {
        Subject currentUser = SecurityUtils.getSubject();
        currentUser.logout();
        Map m = new HashMap();
        m.put("code",0);
        m.put("data","success");
        //TODO 标识和状态未添加

        log(info,"用户退出！","下线！");
        return m;
    }

    void log(UserInfo info, String operation, String status){
        try {
            String username = info.getUsername();
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            UserLog userLog = userLogService.copyProperties(username, request);
            userLog.setOperation(operation);
            userLog.setStatus(status);
            userLog.setTerminal(info.getTerminal());
            User u = userService.getUserByUserName(username);
            if (u != null)
                userLog.setGroupRootCode(u.getGroupRootCode());
            userLogRepository.save(userLog);
        } catch(Exception e) {
            log.error("login log error",e);
        }
    }
}
