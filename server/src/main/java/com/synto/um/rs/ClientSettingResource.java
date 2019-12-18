package com.synto.um.rs;

import com.synto.core.context.SyntoContext;
import com.synto.core.jpa.SyntoRepository;
import com.synto.core.rs.SyntoEntityRest;
import com.synto.um.model.ClientSetting;
import com.synto.um.repository.ClientSettingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.Map;

/**
 * 客户端信息管理
 */
@Slf4j
@Component
@Path("/client")
@PropertySource("classpath:client/clientsetting.yml")//制定读取配置文件的路径
@ConfigurationProperties(prefix = "clientinfo")//指定读取的前缀
public class ClientSettingResource extends SyntoEntityRest<ClientSetting> {

    @Autowired
    private SyntoContext ctx;

    // 初始化信息
    // 发送文件的大小
    @Value("${SEND_FILE_SIZE}")
    private String SEND_FILE_SIZE;
    // 发送文件的后缀
    @Value("${SEND_FILE_SUFFIX}")
    private String SEND_FILE_SUFFIX;
    // 文件存储空间大小(MB)
    @Value("${STORAGE_FILE_SIZE}")
    private String STORAGE_FILE_SIZE;
    // 消息存储空间大小(万条)
    @Value("${STORAGE_MSG_SIZE}")
    private String STORAGE_MSG_SIZE;
    // 消息存储单位 10000
    @Value("${KB_MSG_NUMBER}")
    private String KB_MSG_NUMBER;


    @Autowired
    ClientSettingRepository clientSettingRepository;

    @Override
    public SyntoRepository<ClientSetting> getRepo() {
        return clientSettingRepository;
    }

    /**
     * 初始化客户端设置
     * @return
     */
    @PUT
    @Path("/renew/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public ClientSetting reNewClientSetting(@PathParam("id") Long id, ClientSetting entity) {
        log.info("（＾∀＾●）ﾉｼ com.synto.core.rs.SyntoEntityRest: reNewClientSetting方法");
        Map m = new HashMap();
        try {
            ctx.isValid();
            entity.setId(id);
            entity.setStorageMsgSize(Long.parseLong(STORAGE_MSG_SIZE));
            entity.setStorageFileSize(Long.parseLong(STORAGE_FILE_SIZE));
            entity.setSendFileSize(Integer.parseInt(SEND_FILE_SIZE));
            entity.setKbMsgNumber(Integer.parseInt(KB_MSG_NUMBER));
            entity.setSendFileSuffix(SEND_FILE_SUFFIX);
            ClientSetting c = new ClientSetting();
            c = getRepo().save(entity);
            if(c != null){
                return c;
            }
        } catch (Exception e) {
            log.error("update",e);
        }
        return null;
    }

}
