package com.synto.im.openfire.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.im.openfire.model.MucOffline;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MucOfflineRepository extends SyntoRepository<MucOffline> {
    MucOffline findByUsernameAndRoom(String username, String roomName);
}
