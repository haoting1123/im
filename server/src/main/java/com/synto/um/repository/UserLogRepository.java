package com.synto.um.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.um.model.UserLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Date;
@Repository
public interface UserLogRepository extends SyntoRepository<UserLog> {

    Page<UserLog> findByGroupRootCodeAndTimeBetween(String groupRootCode, Date startTime, Date endTime, Pageable of);

    Page<UserLog> findByGroupRootCode(String groupRootCode, Pageable of);
}
