package com.synto.im.serviceno.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.im.serviceno.model.ServiceNoArticle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceNoArticleRepository extends SyntoRepository<ServiceNoArticle> {
    List<ServiceNoArticle> findByServiceCode(String code);

    Page findByServiceCodeIn(List<String> list, Pageable pageable);
    Page findByServiceCodeInAndTitleContaining(List<String> list, String title, Pageable pageable);

}
