package com.synto.core.security.shiro;

import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.web.servlet.ShiroHttpServletRequest;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;
import org.apache.shiro.web.util.WebUtils;
import org.springframework.util.StringUtils;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.Serializable;

/**
 * 管理session生命周期
 */
@Slf4j
public class SyntoSessionManager extends DefaultWebSessionManager {

  private static final String AUTHORIZATION = "Authorization";

  private static final String REFERENCED_SESSION_ID_SOURCE = "Stateless request";


  @Override
  protected Serializable getSessionId(ServletRequest request, ServletResponse response) {
    log.info("（＾∀＾●）ﾉｼ com.synto.core.security.shiro.SyntoSessionManager：getSessionId方法");//Thread.currentThread().getName()
    String id = WebUtils.toHttp(request).getHeader(AUTHORIZATION);
    //如果请求头中有 Authorization 则其值为sessionId
    if (!StringUtils.isEmpty(id)) {
      request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID_SOURCE, REFERENCED_SESSION_ID_SOURCE);
      request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID, id);
      request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID_IS_VALID, Boolean.TRUE);
      return id;
    }
    //否则按默认规则从cookie取sessionId
    return super.getSessionId(request, response);
  }
}
