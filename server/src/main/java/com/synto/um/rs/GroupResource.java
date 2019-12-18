package com.synto.um.rs;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.synto.core.jpa.SyntoRepository;
import com.synto.core.redis.RedisService;
import com.synto.core.rs.SyntoEntityRest;
import com.synto.im.miniprogram.model.MiniProgram;
import com.synto.um.admin.model.UserAdmin;
import com.synto.um.admin.service.UserAdminService;
import com.synto.um.model.Group;
import com.synto.um.model.vo.GroupUserVO;
import com.synto.um.model.User;
import com.synto.um.model.vo.UserVO;
import com.synto.um.repository.GroupRepository;
import com.synto.um.service.GroupService;
import com.synto.um.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.json.JsonObject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;

/**
 * 组织机构信息管理
 */
@Slf4j
@Component
@Path("/group")
public class GroupResource extends SyntoEntityRest<Group> {

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    GroupService groupService;

    @Autowired
    RedisService redisService;

    @Autowired
    UserAdminService userAdminService;
    @Autowired
    UserService userService;

    @Override
    public SyntoRepository<Group> getRepo() {
        return groupRepository;
    }

    /**
     * 得到直属机构树，以及树下的普通用户
     *
     * @param code
     * @return
     */
    @GET
    @Path("/get/{code}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    @Transactional
    public List<GroupUserVO> getGroupByCode(@PathParam("code") String code) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.GroupResource：getGroupByCode方法");
        List<GroupUserVO> list = new ArrayList<>();
        list.add(groupService.selectVOGroup(code));
        return list;
    }

    /**
     * 只得到groupVO树 包含旗县机构
     *
     * @param groupcode
     * @return
     */
    @GET
    @Path("/tree/{groupcode}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public List<GroupUserVO> getGroup(@PathParam("groupcode") String groupcode) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.GroupResource：getGroup方法");
        List<GroupUserVO> tree = new ArrayList<>();
        GroupUserVO g = groupService.selectGroupVO(groupcode);
        if (g != null)
            tree.add(g);
        return tree;
    }

    /**
     * 得到直属树
     *
     * @param groupcode
     * @return
     */
    @GET
    @Path("/directly/{groupcode}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public List<GroupUserVO> directlyTree(@PathParam("groupcode") String groupcode) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.GroupResource：directlyTree方法");
        // 判断是否为管理员用户
        UserAdmin currentUser = userAdminService.getCurrentAdminUser();
        if (currentUser != null) {
            GroupUserVO groupUserVO = groupService.getDirectlyTree(groupcode);
            List<GroupUserVO> list = new ArrayList<>();
            list.add(groupUserVO);
            return list;
        }
        return null;
    }

    /**
     * 查询该组织机构的用户
     * 去掉用户的密码身份证真实姓名
     * 只得到普通用户
     *
     * @param groupcode
     * @return
     */
    @GET
    @Path("/select/{groupcode}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public List<UserVO> getGroupUsers(@PathParam("groupcode") String groupcode) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.GroupResource：getGroupUsers方法");
        //判断是否为普通用户
        User currentUser = userService.getCurrentUser();
        if (currentUser != null) {
            return groupService.getUsers(groupcode);
        }
        return null;
    }

    /**
     * 根据组织机构号删除组织、管理员、授权文件
     *
     * @param code
     * @return
     */
    @DELETE
    @Path("/delete/{code}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public Group deleteByCode(@PathParam("code") String code) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.GroupResource：deleteByCode方法");
        UserAdmin currentUser = userAdminService.getCurrentAdminUser();
        //判断是否为管理员用户
        if (currentUser != null) {
            return groupService.deleteGroup(code);
        }
        return null;
    }

    @PUT
    @Path("/update")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public Group updateGroup(Group group) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.GroupResource：updateGroup方法");
        return groupService.updateGroup(group);
    }


    /**
     * 添加直属树
     */
    @POST
    @Path("/save")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public Group saveGroup(Group group) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.GroupResource：saveGroup方法");
        return groupService.saveGroup(group);
    }

    /**
     * 添加独立树
     */
    @POST
    @Path("/add")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public Group saveIndependGroup(Group group) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.GroupResource：saveIndependGroup方法");
        return groupService.saveIndependGroup(group);
    }

    /**
     * 节点拖拽排序
     *
     * @param dragCode   当前节点
     * @param dropCode   被移动节点
     * @param parentCode 上级节点
     * @param dropType   拖拽类型
     * @return
     * @throws Exception
     */
    @POST
    @Path("/sequence")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public List<Group> sequence(@QueryParam("dragCode") String dragCode,
                                @QueryParam("dropCode") String dropCode,
                                @QueryParam("parentCode") String parentCode,
                                @QueryParam("dropType") String dropType) throws Exception {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.GroupResource：sequence方法");
        try {
            UserAdmin currentUser = userAdminService.getCurrentAdminUser();
            //判断是否为管理员用户
            if (currentUser != null) {
                List<Group> res = groupService.treeSequence(dragCode, dropCode, parentCode, dropType);
                return res;
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @GET
    @Path("/allgroup")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public List<Group> allGroup() {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.GroupResource：allGroup方法");
        return groupRepository.findAll();
    }

    @GET
    @Path("/message/{groupcode}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public Group message(@PathParam("groupcode") String groupcode) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.GroupResource：message方法 查询的机构码为" + groupcode);
        UserAdmin currentUser = userAdminService.getCurrentAdminUser();
        //判断是否为管理员用户
        if (currentUser != null) {
            List<Group> groupList = groupRepository.findByCode(groupcode);
            if (groupList.size() > 0) {
                Group group = groupRepository.findByCode(groupcode).get(0);
                return group;
            }
        }
        return null;
    }


    /**
     * 根据组织机构代码查询已有机构数
     *
     * @param groupcode
     * @return
     */
    @GET
    @Path("/count/{groupcode}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public int organizeCount(@PathParam("groupcode") String groupcode) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.GroupResource：organizeCount方法 查询的机构编码为" + groupcode);
        int num = 0;
        UserAdmin currentUser = userAdminService.getCurrentAdminUser();
        //判断是否为管理员用户
        if (currentUser != null) {
            return groupRepository.countByCode(groupcode);
        }
        return num;
    }

    /**
     * 根据GroupName和ParentCode查询全部组织机构信息，实现分页
     * 2019/12/6 修改
     *
     * @param page
     * @param size
     * @param groupName
     * @return
     */
    @GET
    @Path("/groupno")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public Page<Group> getAllGroup(@QueryParam("page") int page,
                                   @QueryParam("size") int size,
                                   @QueryParam("groupName") String groupName,
                                   @QueryParam("superOrgCode") String superOrgCode,
                                   @QueryParam("orgCode") String orgCode
    ) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.GroupResource：getAllGroup方法 查询的参数为" + groupName + "," + superOrgCode +  "," + orgCode);
        UserAdmin currentUser = userAdminService.getCurrentAdminUser();
        //判断是否为管理员用户
        if (currentUser != null) {
            Sort sort = new Sort(Sort.Direction.DESC, "id");
            Pageable pageRequest = PageRequest.of(page - 1, size, sort);
            Page<Group> list = groupService.findAll("-1", groupName, superOrgCode, orgCode, pageRequest);
//            if ((groupName != null && !groupName.isEmpty()) || (superOrgCode != null && !superOrgCode.isEmpty()) || (orgCode != null && !orgCode.isEmpty())) {
//
//            }
//            if (groupName != null && !groupName.isEmpty()) {
//                list = groupRepository.findByParentCodeAndGroupNameLikeOrderBySuperiorCodeAscGroupNameAsc("-1", groupName, pageRequest);
//            }
//            list = groupService.getOrganizePage(list);
            return list;
        }
        return null;
    }


    /**
     * 获取所有非直属机构根节点根据ParentCode和GroupName(模糊查询)
     * 2019/12/6 修改
     *
     * @param groupName
     * @return
     */
    @GET
    @Path("/groupno/list")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public List<Group> getGroupNoList(@QueryParam("groupName") String groupName) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.GroupResource：getGroupNoList方法 查询的机构名为" + groupName);
        UserAdmin currentUser = userAdminService.getCurrentAdminUser();
        //判断是否为管理员用户
        if (currentUser != null) {
            List<Group> groupList = null;
            //List<Group> groupList = groupRepository.findByParentCode("-1"); 原代码
            if (groupName != null && !groupName.isEmpty()) {
                groupList = groupRepository.findByParentCodeAndGroupNameLike("-1", "%" + groupName + "%"); //修改后
            } else {
                groupList = groupRepository.findByParentCode("-1"); //修改后
            }
            return groupList;
        }
        return null;
    }

    /**
     * 保存组织机构选择的小程序
     *
     * @return
     */
    @POST
    @Path("/miniprogram")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public int savaSmallprogram(@RequestParam String data, @QueryParam("tmp") String tmp) {
        int num = 0;
        UserAdmin currentUser = userAdminService.getCurrentAdminUser();
        //判断是否为管理员用户
        if (currentUser != null) {
            JSONObject json = JSON.parseObject(data);
            String groupCode = json.getString("groupCode");
            List<String> programCode = json.getJSONArray("programCode").toJavaList(String.class);
            return groupService.savaSmallprogram(groupCode, programCode);
        }
        return num;
    }

    /**
     * 获取组织机构选择的小程序
     *
     * @param groupCode
     * @return
     */
    @GET
    @Path("/{code}/miniprogram")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public List<MiniProgram> savaSmallprogram(@PathParam("code") String groupCode) {
        UserAdmin currentUser = userAdminService.getCurrentAdminUser();
        //判断是否为管理员用户
        if (currentUser != null) {
            return groupService.findSmallProgramByGroupCode(groupCode);
        }
        return null;
    }

    /**
     * 设置是否开通服务号功能
     *
     * @param code
     * @param yn
     * @return
     */
    @POST
    @Path("/{code}/servicelisence/{yn}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public int updateServiceLisence(@PathParam("code") String code, @PathParam("yn") String yn) {
        int num = 0;
        UserAdmin currentUser = userAdminService.getCurrentAdminUser();
        //判断是否为管理员用户
        if (currentUser != null) {
            groupRepository.updateServiceLicense(yn, code);
            return 1;
        }
        return num;
    }

    @GET
    @Path("/{code}/servicelisence")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public String getServiceLisence(@PathParam("code") String code) {
        log.info("（＾∀＾●）ﾉｼ com.synto.um.rs.GroupResource：getServiceLisence方法 查询的机构码为" + code);
        UserAdmin currentUser = userAdminService.getCurrentAdminUser();
        //判断是否为管理员用户
        if (currentUser != null) {
            return groupRepository.findByCode(code).get(0).getServiceLicense();
        }
        return null;
    }
}
