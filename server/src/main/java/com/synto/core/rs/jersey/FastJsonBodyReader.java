package com.synto.core.rs.jersey;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.synto.util.sm4.SM4Utils;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.MessageBodyReader;
import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;

public class FastJsonBodyReader  implements MessageBodyReader<Object> {
    @Autowired
    SM4Utils sm4;

    @Override
    public boolean isReadable(Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType) {
        //return type.isAnnotationPresent(FastJson.class);
        return true;
    }

    @Override
    public Object readFrom(Class<Object> type, Type genericType, Annotation[] annotations, MediaType mediaType, MultivaluedMap<String, String> httpHeaders, InputStream entityStream) throws IOException, WebApplicationException {
        BufferedInputStream bis = new BufferedInputStream(entityStream);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int bytesRead = -1;
        while ((bytesRead = bis.read(buffer)) != -1) {
            baos.write(buffer, 0, bytesRead);
        }
        baos.flush();
        sm4.secretKey = "JeF8U9wHFOMfs2Y8";
        sm4.hexString = false;
        sm4.iv = "UISwD9fW6cFh9SNS";

//        String cipherText = sm4.decryptData_CBC(baos.toString());
//        Object o = JSON.parseObject(cipherText, type);
        Object o = JSON.parseObject(baos.toString(), type);
        return o;
    }
}
