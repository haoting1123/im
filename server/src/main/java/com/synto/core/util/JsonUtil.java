package com.synto.core.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

@Slf4j
public class JsonUtil {
    private static ObjectMapper objectMapper=new ObjectMapper();

    public static <T> T toObejct(String message,Class<T> clzz){
        log.info("（＾∀＾●）ﾉｼ com.synto.core.util.JsonUtil：toObejct方法");
        try {
            return objectMapper.readValue(message, clzz);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static String toString(Object obj){
        log.info("（＾∀＾●）ﾉｼ com.synto.core.util.JsonUtil：toString方法");
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
