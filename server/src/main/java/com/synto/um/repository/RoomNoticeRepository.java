package com.synto.um.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.um.model.RoomNotice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomNoticeRepository extends SyntoRepository<RoomNotice> {

    Page<RoomNotice> findByRoomJid(String roomJid, Pageable pageable);
}
