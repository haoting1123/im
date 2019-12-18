package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name="um_role", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"code"})
})
@Getter
@Setter
public class Role extends SyntoEntity {
    //角色名
    @Column(length = 32)
    String name;

    @Column(length = 32)
    String code;

}
