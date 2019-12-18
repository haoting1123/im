package com.synto.util;

import com.synto.SyntoException;
import lombok.Cleanup;
import lombok.extern.slf4j.Slf4j;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Slf4j
public class FileUtils {

    static String getHome() {
       return System.getProperty("SYNTOHOME","./");
    }

    public static void writeFileByTemplate(Object data,  String outfile, String templateFile){
        String fullPath = getHome() + File.separator +outfile;
        FreemakerTemplate.generate(data,fullPath,templateFile);
    }
    public static void writeProperty(Properties props, String fileName,String comments, boolean append){
        String fullPath = getHome() + File.separator +fileName;
        try {
            @Cleanup
            PrintWriter writer = new PrintWriter(new BufferedWriter( new FileWriter(fullPath,append)));
            props.store(writer,comments);
        } catch (IOException e) {
            throw new SyntoException("fail to write  "+fullPath);
        }
    }
    public static void writeProperty(Properties props, String fileName,String comments){
        String fullPath = getHome() + File.separator +fileName;
        try {
            @Cleanup
            PrintWriter writer = new PrintWriter(new BufferedWriter( new FileWriter(fullPath,true)));
            props.store(writer,comments);
        } catch (IOException e) {
            throw new SyntoException("fail to write  "+fullPath);
        }
    }

    public static void writeMsg( String content, String fileName){
        String fullPath = getHome() + File.separator +fileName;
        try {
            @Cleanup
            PrintWriter writer = new PrintWriter(new BufferedWriter( new FileWriter(fullPath,true)));
            writer.println(content);
        } catch (IOException e) {
            throw new SyntoException("fail to write  "+fullPath);
        }
    }

    public static Properties loadPropertyFileByPath(String fileName) {
        String fullPath = getHome()+ File.separator +fileName;
        Path file = Paths.get(fullPath);
        log.debug("license file path {}",file.toAbsolutePath().toString());
        if (!Files.isReadable(file)) {
            throw new SyntoException("license file must be readable: " + file.toAbsolutePath());
        }
        try {
            OrderedProperties props = new OrderedProperties();
            @Cleanup
            Reader reader =  Files.newBufferedReader(file, StandardCharsets.UTF_8);
            return loadPropertyFile(reader);

        } catch (IOException e) {
            throw new SyntoException( e);
        }
    }

   public static Properties loadPropertyFileByStream(String fileName) {
        try{
            @Cleanup
            InputStream in = FileUtils.class.getClassLoader().getResourceAsStream(fileName);
            return loadPropertyFile(new InputStreamReader(in));
        } catch (SyntoException e){
            throw e;

        } catch(Exception e){
            throw new SyntoException(e);
        }
    }
    static Properties loadPropertyFile(Reader  reader) {
        try {

            OrderedProperties props = new OrderedProperties();
            props.load(reader);
            return props;
        } catch (IOException e) {
            throw new SyntoException(e);
        }
    }

    public static class OrderedProperties extends Properties {

        private static final long serialVersionUID = -4627607243846121965L;

        private final LinkedHashSet<Object> keys = new LinkedHashSet<Object>();

        @Override
        public Enumeration<Object> keys() {
            return Collections.<Object> enumeration(keys);
        }

        @Override
        public Object put(Object key, Object value) {
            keys.add(key);
            return super.put(key, value);
        }

        @Override
        public Set<Object> keySet() {
            return keys;
        }

        @Override
        public Set<String> stringPropertyNames() {
            Set<String> set = new LinkedHashSet<String>();

            for (Object key : this.keys) {
                set.add((String) key);
            }
            return set;
        }

    }

}
