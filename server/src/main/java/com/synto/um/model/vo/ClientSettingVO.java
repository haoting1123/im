package com.synto.um.model.vo;

import com.synto.um.model.ClientSetting;
import lombok.Getter;
import lombok.Setter;

/**
 * 客户端配置
 */
@Getter
@Setter
public class ClientSettingVO extends ClientSetting {

    String xmppDomain;

    //是否保存日志，0不保存，1保存
    String chatLogStorage;

    // 服务器时间戳
    Long serverTimestamp;
}
