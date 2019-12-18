package com.synto.core.context;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class SyntoContext {

    final private SyntoCenter center =  new SyntoCenter();

    public SyntoContext(){
        init();
    }

    final private void init(){
        center.start();
    }

    public boolean isValid(){
        log.info("（＾∀＾●）ﾉｼ com.synto.core.context.SyntoContext: isValid方法");
        return center.isValid();
    }

}
