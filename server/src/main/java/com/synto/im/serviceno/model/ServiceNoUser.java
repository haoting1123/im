package com.synto.im.serviceno.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "um_service_no_user")
@Getter
@Setter
public class ServiceNoUser extends SyntoEntity {

    @Column(name = "service_code",length = 64)
    String serviceCode;

    @Column(name="username", length = 64)
    String username;

}
