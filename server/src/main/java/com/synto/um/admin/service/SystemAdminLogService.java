package com.synto.um.admin.service;

import com.synto.um.model.Group;
import com.synto.um.admin.model.SystemAdminLog;
import com.synto.um.query.OfVcardQuery;
import com.synto.um.repository.GroupRepository;
import com.synto.um.admin.repository.SystemAdminLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SystemAdminLogService {

    @Autowired
    SystemAdminLogRepository systemAdminLogRepository;

    @Autowired
    GroupRepository groupRepository;


    @Autowired
    OfVcardQuery ofVcardQuery;

    /**
     * 查询所有登录日志
     */
    public Page<SystemAdminLog> getAllLoginLog(int page, int size){
        Sort sort = new Sort(Sort.Direction.DESC,"time");
        Pageable pageRequest = PageRequest.of(page-1, size,sort);
        Page<SystemAdminLog> list = systemAdminLogRepository.findAll(pageRequest);
        for (SystemAdminLog loginLog:list){
            List<Group> group=groupRepository.findByCode(loginLog.getGroupCode());
            if(group.size()>0){
                loginLog.setGroupName(group.get(0).getGroupName());
                loginLog.setGroupCode(group.get(0).getCode());
            }
        }
        return list;
    }
}
