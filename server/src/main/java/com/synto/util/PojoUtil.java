package com.synto.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.FatalBeanException;
import org.springframework.lang.Nullable;

import java.beans.PropertyDescriptor;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

public class PojoUtil {
    public static void copy(Object source, Object target) {
        BeanUtils.copyProperties(source, target);
    }
    public static String toJson(Object o) {
        try {
            return new ObjectMapper().writeValueAsString(o);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("to json string " + o, e);
        }
    }

    public static <T> T fromJson(String json, Class<T> clss) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(json, clss);
        } catch (IOException e) {
            throw new RuntimeException("to class " + json + ", " + clss, e);
        }
    }

    public static <T> T fromProperties(Properties props, T target, @Nullable String... ignoreProperties) {

        Class<?> actualEditable = target.getClass();
        PropertyDescriptor[] targetPds = BeanUtils.getPropertyDescriptors(actualEditable);
        List<String> ignoreList = (ignoreProperties != null ? Arrays.asList(ignoreProperties) : null);

        for (PropertyDescriptor targetPd : targetPds) {
            Method writeMethod = targetPd.getWriteMethod();
            if (writeMethod != null && (ignoreList == null || !ignoreList.contains(targetPd.getName()))) {
                String propName = StringUtil.fieldToProperty(targetPd.getName());
                String value = props.getProperty(propName);
                //TODO support more types than string
                //TODO support builder pattern
                if(!writeMethod.getReturnType().equals(String.class))
                    continue;
                if(value == null)
                    continue;
                if (!Modifier.isPublic(writeMethod.getDeclaringClass().getModifiers())) {
                   writeMethod.setAccessible(true);
                }
                try {
                    writeMethod.invoke(target, value);
                } catch (IllegalAccessException |InvocationTargetException e) {
                    e.printStackTrace();
                }
            }
        }
        return target;
    }
    public static Properties toProperties(Object source, @Nullable String... ignoreProperties) {
        Class<?> actualEditable = source.getClass();
        PropertyDescriptor[] sourcePds = BeanUtils.getPropertyDescriptors(actualEditable);

        List<String> ignoreList = ignoreProperties != null ? Arrays.asList(ignoreProperties) : null;

        Properties props = new Properties();
        for (PropertyDescriptor sourcePd : sourcePds) {
            Method readMethod = sourcePd.getReadMethod();
            Class<?> t = readMethod.getReturnType();

            if (readMethod != null && (ignoreList == null || !ignoreList.contains(readMethod.getName())) && !readMethod.getReturnType().equals(Class.class)) {
                    try {
                        if (!Modifier.isPublic(readMethod.getDeclaringClass().getModifiers())) {
                            readMethod.setAccessible(true);
                        }
                        Object value = readMethod.invoke(source);
                        if(value!=null) {
                            String propName = StringUtil.fieldToProperty(sourcePd.getName());
                            props.setProperty(propName, value.toString());
                        }
                    } catch (Throwable ex) {
                        throw new FatalBeanException("Could not read property '" + sourcePd.getName(), ex);
                    }
            }
        }
        return props;
    }

}
