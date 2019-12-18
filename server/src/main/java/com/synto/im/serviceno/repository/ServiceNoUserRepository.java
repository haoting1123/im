package com.synto.im.serviceno.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.im.serviceno.model.ServiceNo;
import com.synto.im.serviceno.model.ServiceNoUser;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ServiceNoUserRepository extends SyntoRepository<ServiceNoUser> {
    List<ServiceNoUser> findByServiceCode(String code);
    @Transactional
    int deleteByServiceCode(String code);
}
