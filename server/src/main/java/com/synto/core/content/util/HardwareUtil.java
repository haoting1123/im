package com.synto.core.content.util;


public class HardwareUtil {

    public static MachineInfo info(){
        String os = System.getProperty("os.name");
        os = os.toUpperCase();

        if("LINUX".equals(os)) {
            return Linux.getInfo();
        } else if(os.startsWith("WIN")){
            return Windows.getInfo();
        }
        return null;
    }
}
