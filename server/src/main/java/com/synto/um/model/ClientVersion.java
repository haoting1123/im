package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

/**
 * 客户端版本管理
 */
@Entity
@Table(name="um_client_version")
@Getter
@Setter
public class ClientVersion extends SyntoEntity {

    //客户端类型 windows/mips/android/ios
    @Column(name="client_type")
    private String clientType;

    // 客户端版本号
    @Column(name="client_version")
    private String clientVersion;

    // 版本描述
    @Column(name="remark")
    private String remark;

    // 内外网标识
    // gov/intenal
    @Column(name="soft_network")
    private String network;

    // 发布时间
    @Column(name="created_time", nullable = true, updatable = false)
    @CreationTimestamp
    Date createdTime;
}
