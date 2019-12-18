package com.synto.util;

import com.synto.um.admin.model.UserAdmin;
import com.synto.um.model.User;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UserUtils {
    public static void filterInfo(User user){
        user.setSalt("");
        user.setPlainPassword("");
        user.setEncryptedPassword("");
        user.setIterations(0);
        user.setServerKey("");
        user.setStoredKey("");
    }

    public static void filterInfo(UserAdmin user){
        user.setSalt("");
        user.setPlainPassword("");
        user.setEncryptedPassword("");
    }

    static final String rgex =".<photo>(.*?)</photo>";
    static final Pattern pattern = Pattern.compile(rgex);// 匹配的模式
    public static String getUserPhoto(String vcard){
        Matcher m = pattern.matcher(vcard);
        while(m.find()){
            return m.group(1);
        }
        return "";
    }
}
