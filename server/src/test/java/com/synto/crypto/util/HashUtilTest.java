package com.synto.crypto.util;

import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.security.MessageDigest;

@Slf4j
@SpringBootTest
@RunWith(SpringRunner.class)
public class HashUtilTest {

    @Test
    public void hash() {
        String data = "123456";
        try {
            MessageDigest hash = null;
            hash = MessageDigest.getInstance("SHA1");
            byte[] bytes = hash.digest(data.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder();
            byte[] var4 = bytes;
            int var5 = bytes.length;

            for (int var6 = 0; var6 < var5; ++var6) {
                byte b = var4[var6];
                sb.append(String.format("%02X", b));
            }

            log.info("加密后" + sb.toString());
        } catch (Exception var8) {
            throw new RuntimeException(var8);
        }
    }
}