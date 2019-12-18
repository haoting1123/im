package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "um_contacts")
@Getter
@Setter
public class Contacts extends SyntoEntity {

    @Column(name = "user_name",length = 64)
    String userName;

    @Column(name = "friend_jid",length = 64)
    String friendJid;

    //别名
    @Column(name = "alias",length = 32)
    String alias;
}
