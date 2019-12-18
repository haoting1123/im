package com.synto.um.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.um.model.GroupVisible;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface GroupVisibleRepository extends SyntoRepository<GroupVisible> {

    List<GroupVisible> findByGroupCode(String groupCode);

    @Transactional
    int deleteByGroupCode(String groupCode);
}
