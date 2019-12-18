package com.synto.core.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface SyntoRepository<T extends SyntoEntity> extends JpaRepository<T, Long> {


}
