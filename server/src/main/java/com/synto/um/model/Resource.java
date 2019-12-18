package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="um_resource")
@Getter
@Setter
public class Resource extends SyntoEntity {

    String code;

    String name;
}
