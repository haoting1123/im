package com.synto.um.service;

import com.synto.um.model.RoomNotice;
import com.synto.um.repository.RoomNoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomNoticeService {

    @Autowired
    RoomNoticeRepository roomNoticeRepository;

    public Page<RoomNotice> select(String roomJid,int page,int size) {
        Sort sort = new Sort(Sort.Direction.DESC,"createTime");
        Pageable pageRequest = PageRequest.of(page-1, size,sort);
        Page<RoomNotice> list =roomNoticeRepository.findByRoomJid(roomJid,pageRequest);
        return list;
    }
}
