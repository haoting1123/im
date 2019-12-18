package com.synto.im.openfire.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Data
@Entity
@Table(name = "syntoim_ofmucoffline",
       indexes = {@Index(name = "ofmucoffline_idx_usernameroom",  columnList="username,room", unique = true)})
public class MucOffline extends SyntoEntity {
    String username;
    String room;
    Long first;
    Long last;

}
