package com.synto.um.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.um.model.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends SyntoRepository<Notice> , JpaSpecificationExecutor {

    Page<Notice> findByTitleLikeAndCodes(String title,String codes, Pageable pageable);

    Page<Notice> findByCodes(String codes, Pageable pageable);

    Notice findTopByIdAfterOrderByIdDesc(Long id);
    Notice findTopByOrderByIdDesc();

    List<Notice> findByOrderByIdDesc();
    List<Notice> findByIdAfterOrderByIdDesc(Long id);

}
