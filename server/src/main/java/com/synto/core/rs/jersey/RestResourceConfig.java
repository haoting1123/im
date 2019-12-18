package com.synto.core.rs.jersey;

import lombok.extern.slf4j.Slf4j;
import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.jackson.internal.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.stereotype.Component;
import org.springframework.util.ClassUtils;
import javax.annotation.PostConstruct;
import javax.ws.rs.Path;
import javax.ws.rs.ext.Provider;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
//@Component
public class RestResourceConfig extends ResourceConfig {
  private String[] pkgs;

  public String[] getPkgs() {
    return pkgs;
  }

  public void setPkgs(String... pkgs) {
    this.pkgs = pkgs;
  }

  @PostConstruct
  public void init() {
    pkgs = new String[] {"com.synto"};
    ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
    // add more annotation filters if you need
    scanner.addIncludeFilter(new AnnotationTypeFilter(Path.class));
    scanner.addIncludeFilter(new AnnotationTypeFilter(Provider.class));
    for(String  scanPackage :getPkgs()) {

      Set<Class<?>> cls = scanner.findCandidateComponents(scanPackage).stream()
              .map(beanDefinition -> {
                return ClassUtils.resolveClassName(beanDefinition.getBeanClassName(), this.getClassLoader());
              })
              .collect(Collectors.toSet());
      this.registerClasses(cls);
    }
    // 注册支持multipart-formdata格式的请求
    this.register(MultiPartFeature.class);

    // 异常处理 Provider 自动注册
//    register(JerseyExceptionHandler.class);
    // 注册spring filter
//    register(RequestContextFilter.class);

//    register(DatatypeConverter.class);
    register(DateConverterProvider.class);
    // 注册数据转换器，支持传参和返回信息json格式与bean之间的自动转换
//    register(JacksonJsonProvider.class);
    register(JacksonFeature.class);
    this.register(FastJsonBodyWriter.class);
    this.register(FastJsonBodyReader.class);
    // 初始化数据库
    //EnvironmentInitializer.instance().initOnce();
  }
}
