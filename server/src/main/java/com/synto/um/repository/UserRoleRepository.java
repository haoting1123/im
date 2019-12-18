package com.synto.um.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.um.model.UserRole;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface UserRoleRepository extends SyntoRepository<UserRole> {

    @Query("select roleCode from UserRole where userId = ?1")
    List<String> getRoleCodeByUserId(String userId);

    @Query("select userId from UserRole where roleCode = ?1")
    List<String> getUserIdByRoleCode(String userId);
}
