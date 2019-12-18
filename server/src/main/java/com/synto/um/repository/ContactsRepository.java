package com.synto.um.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.um.model.Contacts;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ContactsRepository extends SyntoRepository<Contacts> {
    List<Contacts> findByUserName(String userName);

    Contacts findByUserNameAndFriendJid(String userName, String friendUserName);

    List<Contacts> findByUserNameContaining(String key);

    List<Contacts> findByAliasContaining(String key);

    @Transactional
    int deleteByUserNameAndFriendJid(String userName, String friendUserName);
}
