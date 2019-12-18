package com.synto.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.beanutils.BeanUtils;

import java.io.*;
import java.lang.reflect.InvocationTargetException;
import java.util.Properties;

@Slf4j
public class PropertyFileUtil {
    public static final String UTF8="UTF-8";

    public static void loadProperties(Object target, InputStream input, String charset) throws IOException, InvocationTargetException, IllegalAccessException {
            InputStreamReader file = new InputStreamReader(input,charset);
//            char[] ch=new char[2014];
//            int len=file.read(ch);
//            log.info("（＾∀＾●）ﾉｼ 授权文件" + new String(ch,0,len));
              Properties props = new Properties();
              props.load(file);
              log.info(String.valueOf(props));
              BeanUtils.copyProperties(target,props);
    }

    public static void loadProperties(Object target, String applyFile,String charset){
        try {
            FileInputStream input = new FileInputStream(applyFile);
            loadProperties(target, input, charset);
        } catch(Exception e) {
            File f = new File(applyFile);
            System.err.println("----------->> " + f.getAbsolutePath());
            throw new RuntimeException(" failed to load file " + applyFile +", " + f.getAbsolutePath(),e);
        }
    }
}
