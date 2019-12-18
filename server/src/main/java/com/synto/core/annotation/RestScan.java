package com.synto.core.annotation;


import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Repeatable(RestScans.class)
public @interface RestScan {
  String[] value() default {};
}
