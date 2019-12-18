package com.synto.um.admin.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "um_admin")
@Getter
@Setter
public class UserAdmin extends SyntoEntity {
    // 登录账号
    @Column(name="username", length = 256)
    private String username;

    // 昵称
    @Column(name="nickname", length = 256)
    private String nickname;

    //明文密码
    @Column(name = "plainpassword",length = 64)
    String plainPassword;

    //加密密码
    @Column(name = "encryptedpassword",length = 255)
    String encryptedPassword;

    @Column(name = "telephone")
    String telephone;

    @Column(name="salt", length = 64)
    private String salt;

    @Column(name="role_type", length = 64)
    String roleType;

    // 所属组织code
    @Column(name="group_code", length = 255)
    private String groupCode;

    // 所属组织名称
    @Column(name="group_name", length = 128)
    private String groupName;

    //创建时间     nullable true
    @Column(name="created_at", nullable = true, updatable = false)
    @CreationTimestamp
    Date createTime;

    //修改时间     nullable true
    @Column(name="update_time", nullable = true)
    @UpdateTimestamp
    Date updateTime;

    @Override
    public String toString() {
        return "UserAdmin{" +
                "username='" + username + '\'' +
                ", nickname='" + nickname + '\'' +
                ", plainPassword='" + plainPassword + '\'' +
                ", encryptedPassword='" + encryptedPassword + '\'' +
                ", telephone='" + telephone + '\'' +
                ", salt='" + salt + '\'' +
                ", roleType='" + roleType + '\'' +
                ", groupCode='" + groupCode + '\'' +
                ", groupName='" + groupName + '\'' +
                ", createTime=" + createTime +
                ", updateTime=" + updateTime +
                '}';
    }
}
