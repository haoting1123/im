package com.synto.im.miniprogram.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "um_group_mini_program")
@Getter
@Setter
public class GroupMiniProgram extends SyntoEntity {

    @Column(name = "group_code",length = 64)
    String groupCode;

    @Column(name = "program_code",length = 64)
    String programCode;

}
