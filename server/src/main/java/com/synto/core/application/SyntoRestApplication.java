package com.synto.core.application;

import com.synto.core.annotation.RestScan;
import com.synto.core.rs.jersey.RestResourceConfig;
import org.glassfish.jersey.server.ResourceConfig;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

import java.lang.annotation.Annotation;

@EntityScan(basePackages={"com.synto"})
@MapperScan({"com.synto"})
@ComponentScan({"com.synto"})
@RestScan({"com.synto"})
abstract public class SyntoRestApplication {
  @Bean
  public ResourceConfig restClassConfig() {
    RestResourceConfig conf = new RestResourceConfig();
    // getClass ImserviceApplication$$EnhancerBySpringCGLIB
    RestScan restAnn = getAnnocation(this.getClass(), RestScan.class);
    if(restAnn!=null)
      conf.setPkgs(restAnn.value());
    else
      conf.setPkgs("com.synto");
    return conf;
  }
  public static <T extends Annotation> T getAnnocation(Class<?> parent, Class<T> annotaionClss){
    if(parent == null)
      return null;
    T ann = parent.getAnnotation(annotaionClss);
    if(ann !=null)
      return ann;
    return getAnnocation(parent.getSuperclass(), annotaionClss);
  }
}
