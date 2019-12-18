package com.synto.core.security.filter;

import com.synto.core.context.SyntoContext;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@Slf4j
public class XthhCorsFilter implements Filter {
    static final String ORIGIN = "Origin";

    SyntoContext ctx;
    public void setCtx(SyntoContext ctx){
        this.ctx = ctx;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        log.info("（＾∀＾●）ﾉｼ com.synto.core.security.filter.XthhCorsFilter：init方法");
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        log.info("（＾∀＾●）ﾉｼ com.synto.core.security.filter.XthhCorsFilter：defilter方法 进行过滤");
        if(ctx!=null)
            ctx.isValid();

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res ;

        String origin = request.getHeader(ORIGIN);

        response.setHeader("Access-Control-Allow-Origin",request.getHeader("origin"));//* or origin as u prefer
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS, PATCH");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "Origin, content-type, X-Token, authorization, Accept");
        response.setHeader("Access-Control-Expose-Headers", "Location");

        if (request.getMethod().equals("OPTIONS"))
            response.setStatus(HttpServletResponse.SC_OK);
        else
            try {
             // TODO  logout will call org.camunda.bpm.webapp.impl.security.auth.Authentications.updateSession,
             // which cause   org.apache.shiro.session.UnknownSessionException: There is no session with id [30b71055-95d...
             // should integrate camunda security with shiro
                chain.doFilter(request, response);
            }catch (Exception e){
                log.error("（＾∀＾●）ﾉｼ com.synto.core.security.filter.XthhCorsFilter：filter error ", e);
            }

    }

    @Override
    public void destroy() {
        log.info("（＾∀＾●）ﾉｼ com.synto.core.security.filter.XthhCorsFilter：destroy方法");
    }
}
