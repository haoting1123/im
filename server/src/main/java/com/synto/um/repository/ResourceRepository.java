package com.synto.um.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.um.model.Resource;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends SyntoRepository<Resource> {
    Resource findByCode(String code);
}
