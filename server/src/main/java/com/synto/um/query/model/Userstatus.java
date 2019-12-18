package com.synto.um.query.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Userstatus {

    String username;

    String resource;

    int online;

    String presence;

    String lastipaddress;

    String lastlogindate;

    String lastlogoffdate;
}
