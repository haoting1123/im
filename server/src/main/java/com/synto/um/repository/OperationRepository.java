package com.synto.um.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.um.model.Operation;
import org.springframework.stereotype.Repository;

@Repository
public interface OperationRepository extends SyntoRepository<Operation> {
    Operation findByCode(String code);
}
