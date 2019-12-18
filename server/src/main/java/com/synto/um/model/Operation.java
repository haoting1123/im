package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="um_operation")
@Getter
@Setter
public class Operation extends SyntoEntity {

    String code;

    String name;
}
