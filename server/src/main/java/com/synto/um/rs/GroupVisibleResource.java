package com.synto.um.rs;

import com.synto.core.jpa.SyntoRepository;
import com.synto.core.rs.SyntoEntityRest;
import com.synto.um.admin.model.UserAdmin;
import com.synto.um.admin.service.UserAdminService;
import com.synto.um.model.GroupVisible;
import com.synto.um.model.vo.GroupUserVO;
import com.synto.um.model.vo.UserVO;
import com.synto.um.repository.GroupVisibleRepository;
import com.synto.um.service.GroupVisibleService;
import com.synto.um.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;

/**
 * 组织机构树信息管理
 */
@Slf4j
@Component
@Path("/visible")
public class GroupVisibleResource extends SyntoEntityRest<GroupVisible> {

    @Autowired
    GroupVisibleService groupVisibleService;

    @Autowired
    GroupVisibleRepository groupVisibleRepository;

    @Override
    public SyntoRepository<GroupVisible> getRepo() {
        return groupVisibleRepository;
    }

    @Autowired
    UserService userService;

    @Autowired
    UserAdminService userAdminService;

    /**
     * 查询可视的直属组织机构树
     * @param groupcode
     * @return
     */
    @GET
    @Path("/grouptree/{groupcode}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public List<GroupUserVO> getVisibleTree(@PathParam("groupcode") String groupcode){
        GroupUserVO visibleTree = groupVisibleService.getVisibleTree(groupcode);
        List<GroupUserVO> list=new ArrayList<>();
        if(visibleTree != null){
            list.add(visibleTree);
        }
        return list;
    }

    @GET
    @Path("/users/{groupcode}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public List<UserVO> getVisibleUsers(@PathParam("groupcode") String groupcode){
        List<UserVO> list = groupVisibleService.getVisibleUser(groupcode);
        return list;
    }

    /**
     * 添加前清空
     * @param groupVisible
     */
    @POST
    @Path("/add")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    @Transactional
    public void addGroupVisible(GroupVisible groupVisible){
        UserAdmin currentUser = userAdminService.getCurrentAdminUser();
        // 判断是否为管理员
        if(currentUser != null){
            groupVisibleService.addGroupVisible(groupVisible);
        }
    }

    @GET
    @Path("/select/{groupcode}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public List<String> getCodes(@PathParam("groupcode") String groupcode) {
        UserAdmin currentUser = userAdminService.getCurrentAdminUser();
        // 判断是否为管理员
        if(currentUser != null){
            return groupVisibleService.getVisibleCodes(groupcode);
        }
        return null;
    }
}
