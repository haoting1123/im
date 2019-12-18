package com.synto.um.rs;

import com.synto.core.jpa.SyntoEntity;
import com.synto.core.jpa.SyntoRepository;
import com.synto.core.rs.SyntoEntityRest;
import com.synto.um.admin.model.SystemAdminLog;
import com.synto.um.model.Group;
import com.synto.um.model.UserLog;
import com.synto.um.repository.GroupRepository;
import com.synto.um.repository.UserLogRepository;
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

/**
 * 用户日志信息管理
 */
@Slf4j
@Component
@Path("/userlog")
public class UserLogResource extends SyntoEntityRest<UserLog> {

    @Autowired
    UserLogRepository userLogRepository;


    @Autowired
    GroupRepository groupRepository;

    @Override
    public SyntoRepository<UserLog> getRepo() {
        return userLogRepository;
    }

    /**
     * 得到所有登录日志
     *
     * @param
     * @return
     */
    @GET
    @Path("/query")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public Page<UserLog> query(@QueryParam("page") int page,
                                       @QueryParam("size") int size,
                                       @QueryParam("startTime") Date startTime,
                                       @QueryParam("endTime") Date endTime,
                                       @QueryParam("groupRootCode") String groupRootCode) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.UserLogResource：query方法");
        if (startTime !=null && endTime!=null && StringUtils.isNotBlank(groupRootCode)) {
            return  userLogRepository.findByGroupRootCodeAndTimeBetween(groupRootCode,startTime,endTime, PageRequest.of(page - 1, size));
        }else if(StringUtils.isNotBlank(groupRootCode)){
            return  userLogRepository.findByGroupRootCode(groupRootCode,PageRequest.of(page - 1, size));
        }
        return new PageImpl(new ArrayList<SystemAdminLog>());
    }

}
