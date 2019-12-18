package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.List;

@Entity
@Table(name = "um_group_visible")
@Getter
@Setter
public class GroupVisible extends SyntoEntity {

    @Column(name = "group_code")
    String groupCode;

    @Column(name = "visible_code")
    String visibleCode;

    @Transient
    List<String> visibleCodes;

}
