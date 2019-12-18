package com.synto.um.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.um.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface UserRepository extends SyntoRepository<User> {

    @Transactional
    void deleteByGroupCode(String groupCode);

    User findByUsername(String userName);

    List<User> findByGroupCode(String groupCode);

    List<User> findByGroupCodeAndIdentity(String groupCode,String identity);

    Page findByGroupCode(String groupCode, Pageable pageable);

    Page findByUsername(String userName, Pageable pageable);

    Page findByGroupRootCodeAndUsernameLike(String groupRootCode,String userName, Pageable pageable);

    Page findByGroupRootCode(String groupRootCode, Pageable pageable);
    List<User> findByGroupRootCode(String groupRootCode);

    int countByUsername(String username);

    List<User> findTop100ByNameContainingAndIdentityAndGroupRootCodeOrUsernameContainingAndIdentityAndGroupRootCode(String name, String identity0, String groupRootCode0, String username, String identity1, String groupRootCode1);

    @Modifying
    @Transactional
    @Query("update User set groupCode=?1 where groupCode=?2")
    void updateGroupCode(String newCode,String oldCode);

    @Modifying
    @Transactional
    @Query("update User set encryptedPassword=?1,storedKey=?2,serverKey=?3,salt=?4,iterations=?5,plainPassword=?6 where id=?7")
    int updatePassword(String encPassword, String storeKey,
                       String serverKey, String salt,
                       int iteration, String plainPassword, Long id);


    @Modifying
    @Transactional
    @Query("update User set sex=?1,name=?2 where id=?3")
    int updateSexAndName(String sex,String name,Long id);
}
