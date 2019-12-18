package com.synto.core.security.rs;

import com.synto.core.security.service.UserDetailService;
import com.synto.crypto.util.HashUtil;
import com.synto.um.admin.model.UserAdmin;
import com.synto.um.admin.repository.UserAdminRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


@Slf4j
@Component
@Path("/security")
public class LoginResource {

  @Resource
  UserDetailService userAdminService;

  @Autowired
  private UserAdminRepository userAdminRepository;


  /**
   * 登录方法
   * @param info
   * @return
   */
  @POST
  @Path("/login")
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
  public Map login(UserInfo info) {
    log.info("（＾∀＾●）ﾉｼ com.synto.core.security.rs.LoginResource：login方法");
//    单击登录进入方法
    Map m = new HashMap();

//  根据用户名和密码创建Token
    UsernamePasswordToken token = new UsernamePasswordToken(info.getUsername(), HashUtil.hash(info.getPassword()).toCharArray());
//    token.setRememberMe(true);
//    获得Subject认证主体
    Subject currentUser = SecurityUtils.getSubject();
    try {
//      调用Subject的登录方法  进入Realm的doGetAuthenticationInfo方法进行认证 获得info
//      开始认证，这一步会跳转到我们自定义的Realm中
      currentUser.login(token);
      m.put("code",20000);
      m.put("token", "tmp-jskslsls" + new Date().getTime());
//    获得登录身份（用户名）。 Principals代表身份，Credentials代表凭证。
      String username = (String) currentUser.getPrincipal();  //源代码
      UserAdmin userAdmin = this.userAdminService.findUserAdminMessage(username); //源代码
      if(userAdmin == null){
        throw new UnknownAccountException();
      }

      m.put("data",userAdmin);
    } catch (UnknownAccountException e) {
      log.info("UnknownAccountException -- > 账号不存在：",e);
      m.put("code",404);
      m.put("data"," 账号不存在");
    } catch (IncorrectCredentialsException e) {
      log.info("IncorrectCredentialsException -- > 密码不正确：",e);
      m.put("data"," 密码不正确");
      m.put("code",401);
    } catch (Exception e){
      m.put("data"," 账号或密码不正确");
      m.put("code",402);
    }
    return m;
  }


  /**
   * 登出方法
   * @param info
   * @return
   */
  @POST
  @Path("/logout")
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
  public Map logout(UserInfo info) {
    log.info("（＾∀＾●）ﾉｼ com.synto.core.security.rs.LoginResource：logout方法");
    Subject currentUser = SecurityUtils.getSubject();
    currentUser.logout();
    userAdminService.logout(info);
    Map m = new HashMap();
    m.put("code",20000);
    m.put("data","success");
    return m;
  }

  /**
   * 未登录，shiro应重定向到登录界面，此处返回未登录状态信息由前端控制跳转页面
   * @return
   */
  @GET
  @Path(value = "/unauth")
  @Produces(MediaType.APPLICATION_JSON)
  public Map unauth() {
    log.info("（＾∀＾●）ﾉｼ com.synto.core.security.rs.LoginResource：unauth方法");
    Map<String, Object> map = new HashMap<String, Object>();
    map.put("code", "403");
    map.put("msg", "未登录");
    return map;
  }

  /*@GET
  @Path("/login")
  @Produces(MediaType.APPLICATION_JSON)
  public String login2(@QueryParam("username") String username, @QueryParam("password") String password ) {
    UsernamePasswordToken token = new UsernamePasswordToken(username, password.toCharArray());
//    token.setRememberMe(true);
    Subject currentUser = SecurityUtils.getSubject();
    try {
      currentUser.login(token);
      return "success";
    } catch (UnknownAccountException e) {
      return e.getMessage();

    } catch (IncorrectCredentialsException e) {
      return e.getMessage();
    }

  }*/

  /*@GET
  @Path("/logout")
  @Produces(MediaType.APPLICATION_JSON)
  public Map logout2(UserInfo info) {
    Subject currentUser = SecurityUtils.getSubject();
    currentUser.logout();

    Map m = new HashMap();
    m.put("code",20000);
    m.put("data","success");
    return m;
  }*/

  /**
   * 获得当前用户信息
   * @return
   */
  @GET
  @Path("/info")
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
  public Map info2() {
    log.info("（＾∀＾●）ﾉｼ com.synto.core.security.rs.LoginResource：info2方法");
    Subject currentUser = SecurityUtils.getSubject();
    String username = (String)currentUser.getPrincipal();

    Map d = new HashMap();
    d.put("name",username);
    d.put("roles",new String[]{"user"});
    d.put("avatar","/favicon.ico");

    Map m = new HashMap();
    m.put("data",d);
    m.put("code",20000);
    return m;
  }

  /**
   * 验证密码
   * @param userInfo
   * @return
   */
  @POST
  @Path("/checkPwd")
  @Consumes(MediaType.APPLICATION_JSON)
  public Map checkPwd(UserInfo userInfo){
    log.info("（＾∀＾●）ﾉｼ com.synto.core.security.rs.LoginResource：checkPwd方法");
    Map m = new HashMap();
    try{
      UserAdmin userAdmin = userAdminRepository.findFirstByUsername(userInfo.getUsername()); //源代码
      String plainPassword = userAdmin.getPlainPassword();
      String password = HashUtil.hash(userInfo.getPassword());
      if(plainPassword.equals(password)){
        m.put("msg","success");
      }else{
        m.put("msg","error");
      }
    }catch (Exception e){
      m.put("msg","exception");
    }
    return m;
  }
}
