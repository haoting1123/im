package com.synto.core.jpa;

import com.synto.core.jpa.id.generator.sharding.IPIdGenerator;
import com.synto.core.jpa.id.generator.sharding.IdGenerator;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Serializable;

public class SyntoIdGenerator implements  IdentifierGenerator {
  final static Logger logger = LoggerFactory.getLogger(SyntoIdGenerator.class);
  static IdGenerator generator;
  static {
    try {
      //generator = new HostNameIdGenerator();
      generator = new IPIdGenerator();
    } catch(Throwable e){
      logger.error("initialized HostNameIdGenerator error",e);
      throw new RuntimeException(e);
    }
  }

  @Override
  public Serializable generate(SharedSessionContractImplementor session, Object object) throws HibernateException {
    return generator.generateId().longValue();
//    return generator.generateId();
  }
}
