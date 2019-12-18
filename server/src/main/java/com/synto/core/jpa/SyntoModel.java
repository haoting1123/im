package com.synto.core.jpa;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@Setter
@Getter
public class SyntoModel  implements Serializable {
}
