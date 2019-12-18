package com.synto.util;

public class StringUtil {

    //属性单词都是小写，首个大写字母分割， 不支持 缩写的大写字母 如 myCPUName my.cpu.name
    public static String fieldToProperty(String fieldName) {
        char[] chs=fieldName.toCharArray();
        StringBuilder builder = new StringBuilder();
        //有大写字母
        boolean flag = false;
        for(int i=0;i<chs.length;i++){
            char c = chs[i];
            //首个大写字母
            if (c>='A'&&c<='Z') {
                //持续的大写字母
                if(flag || i==0) {
                    builder.append(Character.toLowerCase(c));
                } else {
                    builder.append(".")
                            .append(Character.toLowerCase(c));
                }
            } else {
                flag = false;
                builder.append(c);
            }
        }
        return builder.toString();
    }

    //属性单词都是小写，首个大写字母分割， my.cpu.name  myCpuName
    public static String propertyToField(String propName) {
        char[] chs=propName.toCharArray();
        StringBuilder builder = new StringBuilder();
        for(int i=0;i<chs.length;i++){
            char c = chs[i];
            if (c=='.' &&i<chs.length) {
                c = chs[++i];
                builder.append(Character.toLowerCase(c));
            } else {
                builder.append(c);
            }
        }
        return builder.toString();
    }

    public static String bytesToHexString(byte[] src){
        StringBuilder stringBuilder = new StringBuilder("");
        if (src == null || src.length <= 0) {
            return null;
        }
        for (int i = 0; i < src.length; i++) {
            int v = src[i] & 0xFF;
            String hv = Integer.toHexString(v);
            if (hv.length() < 2) {
                stringBuilder.append(0);
            }
            stringBuilder.append(hv);
        }
        return stringBuilder.toString();
    }
    /**
     * Convert hex string to byte[]
     * @param hexString the hex string
     * @return byte[]
     */
    public static byte[] hexStringToBytes(String hexString) {
        if (hexString == null || hexString.equals("")) {
            return null;
        }
        hexString = hexString.toUpperCase();
        int length = hexString.length() / 2;
        char[] hexChars = hexString.toCharArray();
        byte[] d = new byte[length];
        for (int i = 0; i < length; i++) {
            int pos = i * 2;
            d[i] = (byte) (charToByte(hexChars[pos]) << 4 | charToByte(hexChars[pos + 1]));
        }
        return d;
    }
    /**
     * Convert char to byte
     * @param c char
     * @return byte
     */
    private static byte charToByte(char c) {
        return (byte) "0123456789ABCDEF".indexOf(c);
    }

    public static boolean isNull(String string) {
        return string == null || string.trim().length()==0;
    }
}
