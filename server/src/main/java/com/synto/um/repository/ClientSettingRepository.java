package com.synto.um.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.um.model.ClientSetting;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientSettingRepository extends SyntoRepository<ClientSetting> {

    List<ClientSetting> findAll();

    ClientSetting save(ClientSetting s);
}
