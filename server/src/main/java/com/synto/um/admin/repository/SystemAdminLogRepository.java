package com.synto.um.admin.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.um.admin.model.SystemAdminLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface SystemAdminLogRepository extends SyntoRepository<SystemAdminLog> {

    Page findByGroupRootCodeAndTimeBetweenOrderByTimeDesc(String groupRootCode, Date startTime, Date endTime, Pageable pageable);

    Page findByGroupRootCodeOrderByTimeDesc(String groupRootCode, Pageable pageable);
}
