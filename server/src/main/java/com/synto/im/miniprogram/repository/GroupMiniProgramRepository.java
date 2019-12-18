package com.synto.im.miniprogram.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.im.miniprogram.model.GroupMiniProgram;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface GroupMiniProgramRepository extends SyntoRepository<GroupMiniProgram> {
    @Transactional
    int deleteByGroupCode(String code);

    List<GroupMiniProgram> findByGroupCode(String code);
}
