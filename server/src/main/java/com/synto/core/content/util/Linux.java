package com.synto.core.content.util;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;

class Linux {
    static String executeLinuxCmd(String cmd) {
        String os = System.getProperty("os.name");
        os = os.toUpperCase();

        if(!"LINUX".equals(os))
            throw new UnsupportedOperationException("os:" + os);
        try {
            System.out.println("got cmd job : " + cmd);
            Runtime run = Runtime.getRuntime();
            Process process;
            process = run.exec(cmd);
            InputStream in = process.getInputStream();
            BufferedReader bs = new BufferedReader(new InputStreamReader(in));
            StringBuffer out = new StringBuffer();
            byte[] b = new byte[8192];
            for (int n; (n = in.read(b)) != -1; ) {
                out.append(new String(b, 0, n));
            }

            in.close();
            process.destroy();
            return out.toString();
        } catch (Exception e) {
            return null;
        }

    }

    /**
     * @param cmd    命令语句
     * @param record 要查看的字段
     * @param symbol 分隔符
     * @return
     */
    static String getSerialNumber(String cmd, String record, String symbol) {
        String execResult = executeLinuxCmd(cmd);
        String[] infos = execResult.split("\n");

        for (String info : infos) {
            info = info.trim();
            if (info.indexOf(record) != -1) {
                info.replace(" ", "");
                String[] sn = info.split(symbol);
                return sn[1];
            }
        }
        return null;
    }


    static String getMacAddress() {
        try {
            InetAddress ip =  InetAddress.getLocalHost();
            NetworkInterface network = NetworkInterface.getByInetAddress(ip);
            byte[] mac = network.getHardwareAddress();
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < mac.length; i++) {
//                sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? "-" : ""));
                sb.append(String.format("%02X", mac[i]));
            }
            return sb.toString();
        } catch (SocketException | UnknownHostException e) {
            return null;
        }
    }

    /**
     * 获取CPUID、硬盘序列号、MAC地址、主板序列号
     *
     * @return
     */
    static MachineInfo getInfo() {
        String cpusn = getSerialNumber("dmidecode -t processor | grep 'ID'", "ID", ":");
        String mainboard = getSerialNumber("dmidecode |grep 'Serial Number'", "Serial Number", ":");
        String diskNumber = getSerialNumber("fdisk -l", "Disk identifier", ":");
        String mac = getSerialNumber("ifconfig -a", "ether", " ");
        String mac2 = getMacAddress();
        return MachineInfo.builder()
                .cpusn(cpusn.toUpperCase().replace(" ", ""))
                .disk(diskNumber.toUpperCase().replace(" ", ""))
                .mac(mac.toUpperCase().replace(" ", ""))
                .mainboard(mainboard.toUpperCase().replace(" ", ""))
                .build();
    }

}
