package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "um_authority")
@Getter
@Setter
public class Authority extends SyntoEntity {

    //权限code
    @Column(name = "code",length = 32)
    String code;

    //权限名称
    @Column(name = "name",length = 32)
    String name;

    //资源路径
    @Column(name = "resource_code",length = 128)
    String resourcecode;

    //动作权限
    @Column(name = "operation_code")
    String operationcode;
}
