package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import com.synto.im.license.model.ImLicense;
import lombok.Getter;
import lombok.Setter;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.List;

@Entity
@Table(name="um_group")
@Getter
@Setter
public class Group extends SyntoEntity {

    @Column(name="group_name", length = 128, nullable = true)
    String groupName;

    @Column(name="code" , length = 255, nullable = true)
    String code;

    //直属上级标识
    @Column(name="parent_code", length = 255, nullable = true)
    String parentCode;

    // 旗县等下级机构，独立的管理、财务(如果这个code存在，则是独立的一棵树)
    @Column(name="superior_code", length=64)
    private String superiorCode;

    //排序字段
    @Column(name="gsequence", length=64)
    private Integer gsequence;

    @Column(name="telephone", length = 128, nullable = true)
    String telephone;

    @Column(name="address", length = 128, nullable = true)
    String address;

    //负责的业务
    @Column(name="service", length = 128, nullable = true)
    String service;

    //是否开通服务号功能 y  n
    @Column(name="service_license", length = 64, insertable = false,columnDefinition = "varchar(64) default 'n'")
    String serviceLicense;

    @Transient
    List<Group> children;

    @Transient
    List<User> users;

    @Transient
    List<Role> roles;

    @Transient
    private String superiorName;

    @Transient
    ImLicense imLicense;

    @Override
    public String toString() {
        return "Group{" +
                "groupName='" + groupName + '\'' +
                ", code='" + code + '\'' +
                ", parentCode='" + parentCode + '\'' +
                ", superiorCode='" + superiorCode + '\'' +
                ", gsequence=" + gsequence +
                ", telephone='" + telephone + '\'' +
                ", address='" + address + '\'' +
                ", service='" + service + '\'' +
                ", serviceLicense='" + serviceLicense + '\'' +
                ", children=" + children +
                        ", users=" + users +
                        ", roles=" + roles +
                        ", superiorName='" + superiorName + '\'' +
                        ", imLicense=" + imLicense +
                        '}';
                        }
                        }
