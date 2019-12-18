package com.synto.um.model.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GroupUserVO {

    String id;

    String label;

    String sign;

    List<GroupUserVO> children;
}
