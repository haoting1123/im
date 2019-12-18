package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "ofuser_log")
@Getter
@Setter
public class UserLog extends SyntoEntity {

    //用户id
    @Column(name = "user_id",length = 128)
    Long userId;

    //用户账号
    @Column(name = "username",length = 128)
    String username;

    //用户状态
    @Column(name = "status",length = 64)
    String status;

    // 所属组织code
    @Column(name="group_root_code", length = 255)
    private String groupRootCode;

    // 所属组织code
    @Column(name="group_code", length = 255)
    private String groupCode;

    // 所属组织name
    @Column(name="group_name", length = 128)
    private String groupName;

    //标识PC还是手机
    @Column(name = "terminal",length = 128)
    String terminal;

    //mac地址
    @Column(name = "mac_address",length = 255)
    String macAddress;

    //ip地址
    @Column(name = "ip_address",length = 255)
    String ipAddress;

    //操作
    @Column(name = "operation")
    String operation;

    //时间
    @Column(name = "create_time",updatable = false)
    @CreationTimestamp
    Date time;

}
