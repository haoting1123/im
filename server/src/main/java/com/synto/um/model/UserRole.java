package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "um_user_role")
@Getter
@Setter
public class UserRole extends SyntoEntity {

    @Column(name="role_code", length = 32, nullable = true)
    String roleCode;

    @Column(name="user_id", length = 32, nullable = true)
    String userId;
}
