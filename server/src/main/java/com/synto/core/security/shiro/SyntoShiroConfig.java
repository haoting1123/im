package com.synto.core.security.shiro;

import com.synto.core.context.SyntoContext;
import com.synto.core.security.filter.XthhCorsFilter;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.spring.LifecycleBeanPostProcessor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Properties;

/**
 * 配置Shiro
 * 我们主要配置三个东西：自定义 Realm、安全管理器 SecurityManager 和 Shiro 过滤器。
 */
@Slf4j
@Configuration
public class SyntoShiroConfig {

  /**
   * Spring的Bean post处理器，它自动调用实现{@link org.apache.shiro.util.Initializable}的 init（）和{@link org.apache.shiro.util.Destroyable}接口的 destroy（）方法,。
   * 这个后处理器可以直接在Spring中配置Shiro bean即可。用户不必担心是否必须指定init-method和destroy-method bean属性。
   * 注意：此后处理器无法确定是否已经调用init（）或 destroy（），因此如果在applicationContext中，也不要手动或通过Spring的bean属性调用init-method 或 destroy-method 这些方法。
   *
   * @return
   */
  @Bean
  public LifecycleBeanPostProcessor lifecycleBeanPostProcessor() {
    log.info("（＾∀＾●）ﾉｼ com.synto.core.security.shiro.SyntoShiroConfig：lifecycleBeanPostProcessor方法");
    return new LifecycleBeanPostProcessor();
  }


  @Bean
  public FilterRegistrationBean corsFilter(SyntoContext ctx) {
    log.info("（＾∀＾●）ﾉｼ com.synto.core.security.shiro.SyntoShiroConfig：corsFilter方法");
    FilterRegistrationBean registrationBean = new FilterRegistrationBean();
    XthhCorsFilter cors = new XthhCorsFilter();
    cors.setCtx(ctx);
    registrationBean.setFilter( cors );

    registrationBean.addUrlPatterns("/*");
    registrationBean.setName("cors");//设置优先级
    registrationBean.setOrder(1);//设置优先级
    return registrationBean;
  }
  /**
   * 注入自定义Realm
   * 自定义身份认证
   * 必须写这个类，并加上 @Bean 注解，目的是注入 CustomRealm，
   * 否则会影响 CustomRealm类 中其他类的依赖注入
   *
   * @return
   */
  @Bean
  public CustomRealm customRealm() {
    log.info("（＾∀＾●）ﾉｼ com.synto.core.security.shiro.SyntoShiroConfig：customRealm方法");
    return new CustomRealm();
  }


  /**
   * 注入 securityManager安全管理器
   * DefaultWebSecurityManager
   * @param
   * @return
   */
  @Bean
  public DefaultWebSecurityManager defaultWebSecurityManager() {
    log.info("（＾∀＾●）ﾉｼ com.synto.core.security.shiro.SyntoShiroConfig：defaultWebSecurityManager方法");
    DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager(customRealm());
    //securityManager.setRealm(customRealm);
    return securityManager;
  }



  /**
   * 授权未通过时(403)错误处理,没有这个不会跳转到403页面
   * 没有授权的处理
   * 配合注解的使用，使用代码配置ShiroFilter的，直接是setUnauthorizedUrl
   * 使用该方法可以配置多个异常匹配
   * @return
   */
  @Bean
  public SimpleMappingExceptionResolver getSimpleMappingExceptionResolver() {
    log.info("（＾∀＾●）ﾉｼ com.synto.core.security.shiro.SyntoShiroConfig：getSimpleMappingExceptionResolver方法");
    SimpleMappingExceptionResolver simpleMappingExceptionResolver = new SimpleMappingExceptionResolver();
    Properties mappings = new Properties();
    mappings.setProperty("org.apache.shiro.authz.UnauthorizedException", "/403");
          mappings.setProperty("org.apache.shiro.authz.AuthorizationException", "/403");
    simpleMappingExceptionResolver.setExceptionMappings(mappings);
    return simpleMappingExceptionResolver;
}

  /**
   * 注入Shiro过滤器
   * 使用注解时
   * @param
   * @return
   */
  @Bean
  public ShiroFilterFactoryBean shiroFilterFactoryBean(DefaultWebSecurityManager securityManager) {
    log.info("（＾∀＾●）ﾉｼ com.synto.core.security.shiro.SyntoShiroConfig：shiroFilterFactoryBean方法");
//  定义ShiroFactoryBean
    ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
//  设置自定义的securityManager
    shiroFilterFactoryBean.setSecurityManager(securityManager);

//  LinkedHashMap是有序的，进行顺序拦截器配置
    Map<String, String> filterChainDefinitionMap = new LinkedHashMap<>();
//    //开放接口


    /**
     * 测试代码
     */
    filterChainDefinitionMap.put("/rest/security_my/login_my", "anon");

    filterChainDefinitionMap.put("/rest/userdemo/**", "anon");

// 配置可以匿名访问的地址，可以根据实际情况自己添加，放行一些静态资源等，anon表示放行
    //登录服务
    filterChainDefinitionMap.put("/rest/security/login", "anon");
    filterChainDefinitionMap.put("/rest/um/login", "anon");
    //更新服务
    filterChainDefinitionMap.put("/rest/sc", "anon");
    filterChainDefinitionMap.put("/rest/sc/**", "anon");
    filterChainDefinitionMap.put("/rest/sys/**", "anon");
    filterChainDefinitionMap.put("/rest/security/unauth", "anon");
    filterChainDefinitionMap.put("/rest/security/logout", "anon");
//    filterChainDefinitionMap.put("/rest/application.wadl", "anon");
    filterChainDefinitionMap.put("/static/**", "anon");
    filterChainDefinitionMap.put("/index.html", "anon");
    filterChainDefinitionMap.put("/unauth", "anon");
    filterChainDefinitionMap.put("/", "anon");
//    filterChainDefinitionMap.put("/rest/**", "anon");
//    filterChainDefinitionMap.put("/**", "anon");
//    anthc表示要进行身份认证
    filterChainDefinitionMap.put("/**", "authc");

    // “/user/student” 开头的用户需要角色认证，是“admin”才允许
//    filterChainDefinitionMap.put("/user/student*/**", "roles[admin]");
    // “/user/teacher” 开头的用户需要权限认证，是“user:create”才允许
//    filterChainDefinitionMap.put("/user/teacher*/**", "perms[\"user:create\"]");






    shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);

//  设置默认登录的URL，身份验证失败会访问该URL
    shiroFilterFactoryBean.setLoginUrl("/rest/security/unauth");

    // 设置成功之后要跳转的链接
//    shiroFilterFactoryBean.setSuccessUrl("/success");

    // 设置未授权界面，权限认证失败会访问该 URL
//    shiroFilterFactoryBean.setUnauthorizedUrl("/unauthorized");



    return shiroFilterFactoryBean;
  }
//
//
//  /**
//   * shiroFilter
//   * 不使用注解的拦截器写法
//   * 没有权限之后的跳转必须是登录以后才能识别的
//   *     这些名为anon,authc,roles,perms等的过滤器，实际上是一些{@link javax.servlet.Filter}接口的实现，它们都位于org.apache.shiro.web.filter包中。
//   * 通过{@link org.apache.shiro.web.filter.mgt.DefaultFilter} 知道了那些拦截器的命名
//   *         anon对应{@link org.apache.shiro.web.filter.authc.AnonymousFilter}
//   *         authc对应{@link org.apache.shiro.web.filter.authc.FormAuthenticationFilter}
//   *         roles对应{@link org.apache.shiro.web.filter.authz.RolesAuthorizationFilter}
//   *         perms对应{@link org.apache.shiro.web.filter.authz.PermissionsAuthorizationFilter}
//   * @param defaultWebSecurityManager
//   * @return
//   */
//  @Bean
//  public ShiroFilterFactoryBean shirFilter(DefaultWebSecurityManager defaultWebSecurityManager) {
//    ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
//    // 必须设置 SecurityManager
//    shiroFilterFactoryBean.setSecurityManager(defaultWebSecurityManager);
//    // setLoginUrl 如果不设置值，默认会自动寻找Web工程根目录下的"/login.jsp"页面 或 "/login" 映射
//    shiroFilterFactoryBean.setLoginUrl("/login");
//    // 设置无权限时跳转的 url;
//    shiroFilterFactoryBean.setUnauthorizedUrl("/403");
//    // 登录成功后要跳转的链接
//    shiroFilterFactoryBean.setSuccessUrl("/index");
//
//    // 设置拦截器
//    Map<String, String> filterChainDefinitionMap = new LinkedHashMap<>();
//    //开放接口
//    filterChainDefinitionMap.put("/login", "anon");
//    filterChainDefinitionMap.put("/static/**", "anon");
//    filterChainDefinitionMap.put("/index", "anon");
//    filterChainDefinitionMap.put("/", "anon");
//
//    //用户，需要角色权限 “user”
//    filterChainDefinitionMap.put("/insert", "perms[user:insert]");
//    filterChainDefinitionMap.put("/update", "perms[user:update]");
//    filterChainDefinitionMap.put("/delete", "perms[user:delete]");
//    filterChainDefinitionMap.put("/select", "perms[user:select]");
//
//    //其余接口一律拦截
//    //主要这行代码必须放在所有权限设置的最后，不然会导致所有 url 都被拦截
////        过滤链定义，从上向下顺序执行，一般将/**放在最为下边
//    filterChainDefinitionMap.put("/**", "authc");
//
//    shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
//    return shiroFilterFactoryBean;
//  }

}
