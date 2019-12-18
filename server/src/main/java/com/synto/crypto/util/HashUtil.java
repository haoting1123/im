package com.synto.crypto.util;

import lombok.extern.slf4j.Slf4j;

import java.security.MessageDigest;

@Slf4j
public final class HashUtil {
    static final String ALGORITHM = "SHA1";

    //
    public static String hash(String data) {
        log.info("（＾∀＾●）ﾉｼ com.synto.crypto.util.HashUtil：hash方法");
        if (data.isEmpty()) {
            return "";
        } else {
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

                return sb.toString();
            } catch (Exception var8) {
                throw new RuntimeException(var8);
            }
        }
    }

//    测试
//    public static void main(String[] args) {
//        String msg = "111111";
//        String h1 = hash(msg);
//        String h2 = hash(msg);
//        System.out.println(h1);
//        System.out.println(h2);
//        System.out.println(h1.equals(h2));
//    }
}