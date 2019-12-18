/**
 * fshows.com
 * Copyright (C) 2013-2018 All Rights Reserved.
 */
package com.synto.core.security.shiro;

import com.synto.um.admin.model.UserAdmin;
import com.synto.um.admin.repository.UserAdminRepository;
import com.synto.um.model.User;
import com.synto.um.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 自定义Realm
 * Realm 是控制认证和授权的核心部分，也是开发人员必须自己实现的部分。
 * 实现自定义 Realm 最快捷的方式是继承 AuthorizingRealm 类。
 *
 * @author chenhx
 * @version CustomRealm.java, v 0.1 2018-08-03 下午 2:40
 */
@Slf4j
public class CustomRealm extends AuthorizingRealm {

    @Autowired
    private UserAdminRepository userAdminRepository;
    @Autowired
    private UserRepository userRepository;

    /**
     * 授权信息
     * SimpleAuthorizationInfo进行角色的添加和权限的添加。
     * 为当前登录成功的用户授予权限和分配角色
     * 将authorizationInfo返回给Shiro进行校验
     * @param principalCollection
     * @return
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        log.info("（＾∀＾●）ﾉｼ com.synto.core.security.shiro.CustomRealm：doGetAuthorizationInfo方法");
//       获取用户名
        String username = (String) super.getAvailablePrincipal(principalCollection);
        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
//        获取角色
//        Set<String> roles = userDao.selectRolesByUsername(username);
//        给该用户设置角色
//        authorizationInfo.setRoles(roles);
//        roles.forEach(role -> {
//            获取权限
//            Set<String> permissions = this.userDao.selectPermissionsByRole(role);
//            给该用户设置权限
//            authorizationInfo.addStringPermissions(permissions);
//        });
        return authorizationInfo;
    }

    /**
     * 进行认证
     * 用来验证当前登录的用户，获得认证信息
     * 先根据用户名从数据库查出对应的用户，即使输入的密码不正确照样可以查询出该用户
     * 然后将该用户封装到SimpleAuthenticationInfo返回给Shiro
     * 使用Shiro将封装的用户信息和输入信息进行对比、校验。校验通过则允许用户登录，否则跳转到指定页面。
     * @param authenticationToken
     * @return
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        log.info("（＾∀＾●）ﾉｼ com.synto.core.security.shiro.CustomRealm：doGetAuthenticationInfo方法");
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
//       根据token获取用户名
        String username = token.getUsername();
        if (username == null) {
            throw new org.apache.shiro.authz.AuthorizationException("认证失败");
        }
        //通过username从数据库中查找 UserAdmin对象
        //实际项目中，这里可以根据实际情况做缓存，如果不做，Shiro自己也是有时间间隔机制，2分钟内不会重复执行该方法
        UserAdmin u = this.userAdminRepository.findFirstByUsername(username);

        if(u != null) {
            //获得登录用户的明文密码
            String password = u.getPlainPassword();

            if (StringUtils.isBlank(password)) {
                throw new org.apache.shiro.authz.AuthorizationException("认证失败");
            }
//          log.info(getName());
//          传入用户名和密码进行身份认证，并返回认证信息
            return new SimpleAuthenticationInfo(username, password, getName()); // 源代码
            //return new SimpleAuthenticationInfo(u, password, getName());
        } else {
            // 兼容普通用户登录
            User user = this.userRepository.findByUsername(username);
            if(user != null){
                String password = user.getPlainPassword();
                if(StringUtils.isBlank(password)){
                    throw new org.apache.shiro.authz.AuthorizationException("认证失败");
                }
//              将用户名，密码缓存，返回信息 不为空则进入密码比较类，若为空则报错
                return new SimpleAuthenticationInfo(username, password, getName());  // 源代码
//                return new SimpleAuthenticationInfo(user, password, getName());
            }
        }
        throw new org.apache.shiro.authz.AuthorizationException("认证失败");
    }
}
