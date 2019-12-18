package com.synto.um.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.um.model.ClientVersion;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientVersionRepository extends SyntoRepository<ClientVersion> {
    ClientVersion findTopByClientTypeOrderByCreatedTimeDesc(String clientType);
    ClientVersion findTopByClientTypeAndNetworkOrderByCreatedTimeDesc(String clientType, String network);
}
