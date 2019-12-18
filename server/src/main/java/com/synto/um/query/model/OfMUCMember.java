package com.synto.um.query.model;

import com.synto.core.jpa.SyntoModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OfMUCMember extends SyntoModel {

    Long roomID;
    String jid;
    String nickname;
    String firstName;
    String lastName;
    String url;
    String email;
    String faqentry;

    String roomJid;

}
