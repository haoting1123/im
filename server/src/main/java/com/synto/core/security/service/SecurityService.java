package com.synto.core.security.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class SecurityService {
    public String currentUsername(){
        log.info("（＾∀＾●）ﾉｼ com.synto.core.security.service.SecurityService：currentUsername方法");
        Subject current = SecurityUtils.getSubject();
        if(current!=null)
           return (String) current.getPrincipal();
        throw new RuntimeException("SecurityUtils.getSubject() null");
    }
}
