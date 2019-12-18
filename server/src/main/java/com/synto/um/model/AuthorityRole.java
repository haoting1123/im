package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "um_authority_role")
@Getter
@Setter
public class AuthorityRole extends SyntoEntity {

    @Column(name="auth_code", length = 32, nullable = true)
    String authCode;

    @Column(name="role_code", length = 32, nullable = true)
    String roleCode;

}
