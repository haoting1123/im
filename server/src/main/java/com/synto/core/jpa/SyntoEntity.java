package com.synto.core.jpa;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@MappedSuperclass
@Setter
@Getter
public class SyntoEntity extends SyntoModel {

  @Id
//  @GeneratedValue(strategy = GenerationType.AUTO)
  @GeneratedValue(generator = "starwayGenerator")
  @GenericGenerator(name = "starwayGenerator", strategy = "com.synto.core.jpa.SyntoIdGenerator")
  @Column(name = "id")
  private Long id;

//
//  public Long getId() {
//    return id;
//  }
//
//  public void setId(Long id) {
//    this.id = id;
//  }
}
