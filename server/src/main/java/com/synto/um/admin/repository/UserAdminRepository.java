package com.synto.um.admin.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.um.admin.model.UserAdmin;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface UserAdminRepository extends SyntoRepository<UserAdmin> {

    UserAdmin findByUsername(String username);
    UserAdmin findFirstByUsername(String username);
    List<UserAdmin> findByGroupCode(String groupCode);


    int countByUsername(String username);


    @Modifying
    @Transactional
    @Query("update UserAdmin u set  u.plainPassword=:password where u.groupCode=:groupCode")
    int resetPassword(@Param("password") String password,@Param("groupCode") String groupCode);
}
