package com.synto.core.rs.jersey;

import com.alibaba.fastjson.JSONObject;
import com.synto.util.sm4.SM4Utils;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.MessageBodyWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;
import java.util.Base64;

public class FastJsonBodyWriter implements MessageBodyWriter<Object> {
    @Autowired
    SM4Utils sm4;

    @Override
    public boolean isWriteable(Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType) {
      //  return type.isAnnotationPresent(FastJson.class);
        return true;
    }

    @Override
    public long getSize(Object o, Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType) {
        return -1;
    }

    @Override
    public void writeTo(Object t, Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType, MultivaluedMap<String, Object> httpHeaders, OutputStream entityStream) throws IOException, WebApplicationException {

        sm4.secretKey = "JeF8U9wHFOMfs2Y8";
        sm4.hexString = false;
        sm4.iv = "UISwD9fW6cFh9SNS";

//        String cipherText = sm4.encryptData_CBC(JSONObject.toJSONString(t));
//        entityStream.write(cipherText.getBytes());
        entityStream.write(JSONObject.toJSONString(t).getBytes());
//        entityStream.write(Base64.getEncoder().encode(JSONObject.toJSONString(t).getBytes()));
    }

}
