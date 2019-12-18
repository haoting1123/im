package com.synto.um.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.um.model.Authority;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorityRepository extends SyntoRepository<Authority> {
    Authority findByCode(String code);
}
