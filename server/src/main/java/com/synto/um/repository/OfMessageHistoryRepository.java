package com.synto.um.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.um.model.Notice;
import com.synto.um.model.OfMessageHistory;
import org.apache.ibatis.annotations.Select;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface OfMessageHistoryRepository extends SyntoRepository<OfMessageHistory> {

    long countBySender(String sender);

    @Transactional
    long deleteBySender(String sender);

}
