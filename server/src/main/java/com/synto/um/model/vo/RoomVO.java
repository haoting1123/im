package com.synto.um.model.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class RoomVO {
    String roomJid;
    String name;
    List<MemberVO> memberList = new ArrayList<>();
}
