package com.synto.im.miniprogram.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "um_mini_program")
@Getter
@Setter
public class MiniProgram extends SyntoEntity {

    @Column(name = "name",length = 64)
    String name;

    @Column(name = "code",length = 64)
    String code;

    @Column(name = "url",length = 512)
    String url;

    @Column(name = "remark",length = 2000)
    String remark;

}
