package com.synto.um.model.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactsVO {
    Long id;
    String userName;
    String friendJid;
    String alias;
    String vcard;
    String groupCode;
    String groupName;
}
