package com.synto.im.miniprogram.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.im.miniprogram.model.MiniProgram;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MiniProgramRepository extends SyntoRepository<MiniProgram> {
    MiniProgram findFirstByCode(String code);

    List<MiniProgram> findByCodeIn(List<String> code);

    @Query("select m from MiniProgram m, GroupMiniProgram g  where m.code =g.programCode and g.groupCode =:groupCode")
    List<MiniProgram> findByGroupCode(@Param("groupCode") String groupCode);
}
