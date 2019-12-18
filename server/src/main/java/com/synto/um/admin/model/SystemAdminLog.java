package com.synto.um.admin.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "um_system_admin_log")
@Setter
@Getter
public class SystemAdminLog extends SyntoEntity {

    // 登录账号
    @Column(name="username", length = 256)
    private String username;

    // 昵称
    @Column(name="nickname", length = 256)
    private String nickname;

    // 所属组织
    @Column(name="group_code", length = 255)
    private String groupCode;

    // 所属组织
    @Column(name="group_name", length = 128)
    private String groupName;

    // 根机构Code
    @Column(name="group_root_code", length = 128)
    private String groupRootCode;

    //时间
    @Column(name = "created_time",updatable = false)
    @CreationTimestamp
    Date time;

    //操作
    @Column(name = "operation")
    String operation;
}
