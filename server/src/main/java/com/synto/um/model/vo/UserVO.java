package com.synto.um.model.vo;

import com.synto.um.model.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserVO extends User {
    String vcard;
    String photo;
    int online;
}
