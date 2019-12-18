package com.synto.um.service;

import com.synto.um.model.Group;
import com.synto.um.model.User;
import com.synto.um.model.UserLog;
import com.synto.um.repository.GroupRepository;
import com.synto.um.repository.UserLogRepository;
import com.synto.um.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.Date;


@Service
public class UserLogService {

    @Autowired
    UserLogRepository userLogRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    GroupRepository groupRepository;

    /**
     * 得到user的信息
     * TODO mac可能有问题
     *
     * @param username
     * @return
     */
    public UserLog copyProperties(String username, HttpServletRequest request) {
        User user = userRepository.findByUsername(username);
        Long id = user.getId();
        String groupCode = user.getGroupCode();
        UserLog userLog = new UserLog();
        userLog.setUserId(id);
        BeanUtils.copyProperties(user, userLog);
        if(groupRepository.findByCode(groupCode).size()>0){
            Group group = groupRepository.findByCode(groupCode).get(0);
            if (group!=null) {
                userLog.setGroupName(group.getGroupName());
            }
        }
        String ip = getIp(request);
//        String macAddress = getMacAddrByIp(ip);
        userLog.setIpAddress(ip);
//        userLog.setMacAddress(macAddress);
//        Date date=new Date();
        return userLog;
    }


    public String getIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip != null) {
            if (!ip.isEmpty() && !"unKnown".equalsIgnoreCase(ip)) {
                int index = ip.indexOf(",");
                if (index != -1) {
                    return ip.substring(0, index);
                } else {
                    return ip;
                }
            }
        }
        ip = request.getHeader("X-Real-IP");
        if (ip != null) {
            if (!ip.isEmpty() && !"unKnown".equalsIgnoreCase(ip)) {
                return ip;
            }
        }
        ip = request.getHeader("Proxy-Client-IP");
        if (ip != null) {
            if (!ip.isEmpty() && !"unKnown".equalsIgnoreCase(ip)) {
                return ip;
            }
        }
        ip = request.getHeader("WL-Proxy-Client-IP");
        if (ip != null) {
            if (!ip.isEmpty() && !"unKnown".equalsIgnoreCase(ip)) {
                return ip;
            }
        }
        ip = request.getRemoteAddr();
        return ip.equals("0:0:0:0:0:0:0:1") ? "127.0.0.1" : ip;
    }

    static String getMacAddrByIp(String ip) {
        String str = "";
        String macAddress = "";
        final String LOOPBACK_ADDRESS = "127.0.0.1";
        // 如果为127.0.0.1,则获取本地MAC地址。
        if (LOOPBACK_ADDRESS.equals(ip)) {
            InetAddress inetAddress = null;
            try {
                inetAddress = InetAddress.getLocalHost();
            } catch (UnknownHostException e) {
                e.printStackTrace();
            }
            // 貌似此方法需要JDK1.6。
            byte[] mac = new byte[0];
            try {
                mac = NetworkInterface.getByInetAddress(inetAddress)
                        .getHardwareAddress();
            } catch (SocketException e) {
                e.printStackTrace();
            }
            // 下面代码是把mac地址拼装成String
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < mac.length; i++) {
                if (i != 0) {
                    sb.append("-");
                }
                // mac[i] & 0xFF 是为了把byte转化为正整数
                String s = Integer.toHexString(mac[i] & 0xFF);
                sb.append(s.length() == 1 ? 0 + s : s);
            }
            // 把字符串所有小写字母改为大写成为正规的mac地址并返回
            macAddress = sb.toString().trim().toUpperCase();
            return macAddress;
        } else {
            // 获取非本地IP的MAC地址
            try {
                Process p = Runtime.getRuntime()
                        .exec("nbtstat -A " + ip);
                InputStreamReader ir = new InputStreamReader(p.getInputStream());

                BufferedReader br = new BufferedReader(ir);

                while ((str = br.readLine()) != null) {
                    if (str.indexOf("MAC") > 1) {
                        macAddress = str.substring(str.indexOf("MAC") + 9, str.length());
                        macAddress = macAddress.trim();
                        break;
                    }
                }
                p.destroy();
                br.close();
                ir.close();
            } catch (IOException ex) {
            }
            return macAddress;
        }

    }
}
