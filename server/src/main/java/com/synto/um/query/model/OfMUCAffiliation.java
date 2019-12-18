package com.synto.um.query.model;

import com.synto.core.jpa.SyntoModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OfMUCAffiliation extends SyntoModel {

    Long roomID;
    String jid;
    Integer affiliation;
    String nickname;

}
