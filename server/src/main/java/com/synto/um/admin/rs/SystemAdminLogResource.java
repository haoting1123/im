package com.synto.um.admin.rs;

import com.synto.core.jpa.SyntoRepository;
import com.synto.core.rs.SyntoEntityRest;
import com.synto.um.model.Group;
import com.synto.um.admin.model.SystemAdminLog;
import com.synto.um.repository.GroupRepository;
import com.synto.um.admin.repository.SystemAdminLogRepository;
import com.synto.um.admin.service.SystemAdminLogService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
@Path("/loginlog")
@Slf4j
public class SystemAdminLogResource extends SyntoEntityRest<SystemAdminLog> {

    @Autowired
    SystemAdminLogRepository systemAdminLogRepository;

    @Autowired
    SystemAdminLogService systemAdminLogService;


    @Autowired
    GroupRepository groupRepository;
    @Override
    public SyntoRepository<SystemAdminLog> getRepo() {
        return systemAdminLogRepository;
    }

    /**
     * 得到所有登录日志
     *
     * @param
     * @return
     */
    @GET
    @Path("/get")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public Page<SystemAdminLog> getAll(@QueryParam("page") int page,
                                       @QueryParam("size") int size,
                                       @QueryParam("startTime") Date startTime,
                                       @QueryParam("endTime") Date endTime,
                                       @QueryParam("groupRootCode") String groupRootCode) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.admin.rs.SystemAdminLogResource：getAll方法");
        Page<SystemAdminLog> list = new PageImpl(new ArrayList<SystemAdminLog>());
        //修改方法为按时间降序
        if (startTime !=null && endTime!=null && StringUtils.isNotBlank(groupRootCode)) {
            list = systemAdminLogRepository.findByGroupRootCodeAndTimeBetweenOrderByTimeDesc(groupRootCode,startTime,endTime, PageRequest.of(page - 1, size));
            for (SystemAdminLog loginLog:list){
                List<Group> group=groupRepository.findByCode(loginLog.getGroupCode());
                if(group.size()>0){
                    loginLog.setGroupName(group.get(0).getGroupName());
                    loginLog.setGroupCode(group.get(0).getCode());
                }
            }
            return list;
        }else if(StringUtils.isNotBlank(groupRootCode)){
            list = systemAdminLogRepository.findByGroupRootCodeOrderByTimeDesc(groupRootCode,PageRequest.of(page - 1, size));
            for (SystemAdminLog loginLog:list){
                List<Group> group=groupRepository.findByCode(loginLog.getGroupCode());
                if(group.size()>0){
                    loginLog.setGroupName(group.get(0).getGroupName());
                    loginLog.setGroupCode(group.get(0).getCode());
                }
            }

        }
        return list;
    }


}
