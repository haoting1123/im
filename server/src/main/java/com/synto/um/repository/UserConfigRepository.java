package com.synto.um.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.um.model.UserConfig;
import org.springframework.stereotype.Repository;

@Repository
public interface UserConfigRepository extends SyntoRepository<UserConfig> {
    UserConfig findFirstByUsername(String username);
}
