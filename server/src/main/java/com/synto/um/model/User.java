package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;

/**
 * 用户表
 */
@Entity
@Table(name="ofuser" , uniqueConstraints = {
        @UniqueConstraint(columnNames = {"username"})
})
@Setter
@Getter
public class User extends SyntoEntity {

    //账号
    @Column(name="username", length = 64, nullable = true)
    String username;

    @Column(name = "storedkey",length = 32)
    String storedKey;

    @Column(name = "serverkey",length = 32)
    String serverKey;

    @Column(name = "salt",length = 32)
    String salt;

    @Column(name = "iterations",length = 11)
    Integer iterations;

    //明文密码
    @Column(name = "plainpassword",length = 64)
    String plainPassword;

    //加密密码
    @Column(name = "encryptedpassword",length = 255)
    String encryptedPassword;

    //昵称     nullable true
    @Column(name="name", length = 100, nullable = true)
    String name;

    //邮箱     nullable true
    @Column(name="email", length = 100, nullable = true)
    String email;

    //创建时间
    @Column(name = "creationdate",length = 64)
    //@CreationTimestamp
    String createDate;

    //修改时间，只记录最后一次
    @Column(name = "modificationdate",length = 64)
    //@UpdateTimestamp
    String modificationDate;

    //默认为身份证   nullable true
    @Column(name="user_card", length = 18, nullable = true)
    String userCard;

    //性别     nullable true
    @Column(name="sex", length = 4, nullable = true)
    String sex;

    @Column(name = "telephone", length = 32)
    String telephone;

    //状态
    @Column(name = "status" ,length = 8)
    String status;

    //组织机构code
    @Column(name = "group_code",length = 256, nullable = true)
    String groupCode;

    //组织机构根code
    @Column(name = "group_root_code",length = 100, nullable = true)
    String groupRootCode;

    //用户身份 0是管理员，1是普通用户
    @Column(name = "identity",length = 64)
    String identity;

    @Transient
    String groupName;

    @Transient
    Group group;

    @Transient
    Role role;

    @Transient
    String newPassword;

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", storedKey='" + storedKey + '\'' +
                ", serverKey='" + serverKey + '\'' +
                ", salt='" + salt + '\'' +
                ", iterations=" + iterations +
                ", plainPassword='" + plainPassword + '\'' +
                ", encryptedPassword='" + encryptedPassword + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", createDate='" + createDate + '\'' +
                ", modificationDate='" + modificationDate + '\'' +
                ", userCard='" + userCard + '\'' +
                ", sex='" + sex + '\'' +
                ", telephone='" + telephone + '\'' +
                ", status='" + status + '\'' +
                ", groupCode='" + groupCode + '\'' +
                ", groupRootCode='" + groupRootCode + '\'' +
                ", identity='" + identity + '\'' +
                ", groupName='" + groupName + '\'' +
                ", group=" + group +
                ", role=" + role +
                ", newPassword='" + newPassword + '\'' +
                '}';
    }
}
