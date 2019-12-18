package com.synto.im.serviceno.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "um_service_no")
@Getter
@Setter
public class ServiceNo extends SyntoEntity {

    @Column(name = "group_root_code",length = 64)
    String groupRootCode;

    @Column(name = "name",length = 64)
    String name;

    @Column(name = "code",length = 64)
    String code;

    @Column(name = "remark",length = 2000)
    String remark;

}
