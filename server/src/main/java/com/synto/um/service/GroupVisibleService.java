package com.synto.um.service;

import com.synto.um.model.GroupVisible;
import com.synto.um.model.vo.GroupUserVO;
import com.synto.um.model.vo.UserVO;
import com.synto.um.repository.GroupRepository;
import com.synto.um.repository.UserRepository;
import com.synto.um.repository.GroupVisibleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GroupVisibleService {

    @Autowired
    GroupVisibleRepository groupVisibleRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @Autowired
    GroupService groupService;

    @Autowired
    GroupRepository groupRepository;


    /**
     * 得到可见机构数组
     */
    public List<String> getVisibleCodes(String groupCode){
        List<GroupVisible> list = groupVisibleRepository.findByGroupCode(groupCode);
        List<String> codes=new ArrayList<>();
        if (list!=null&&list.size()>0){
            for (GroupVisible groupVisible:list){
                codes.add(groupVisible.getVisibleCode());
            }
        }
        return codes;
    }

    /**
     * 前端用户得到可见的树
     */
    public GroupUserVO getVisibleTree(String groupCode){
        String rootCode = groupService.getRootCode(groupCode);
        GroupUserVO group = groupService.getDirectlyTree(rootCode);
        if(group == null){
            return null;
        }
        return visibleGroup(group,groupCode);
    }

    /**
     * 删除树中的隐藏节点
     */
    private GroupUserVO visibleGroup(GroupUserVO group,String groupCode){
        List<GroupUserVO> children = group.getChildren();
        if (children!=null&&children.size()>0){
            List<GroupUserVO> newChildren=new ArrayList<>();
            for (GroupUserVO child:children){
                GroupUserVO groupUserVO = deleteUnVisible(child, groupCode);
                if (groupUserVO!=null){
                    newChildren.add(groupUserVO);
                }
                visibleGroup(child,groupCode);
            }
            group.setChildren(newChildren);
        }
        return group;
    }

    /**
     * 判断节点是否可见,并返回
     * @param groupUserVO
     * @param groupCode
     * @return
     */
    private GroupUserVO deleteUnVisible(GroupUserVO groupUserVO,String groupCode){
        String code = groupUserVO.getId();
        List<GroupVisible> list = groupVisibleRepository.findByGroupCode(code);
        //如果可见表中没有该groupcode表示该group对所有人可见, 对自己也可见
        if (list==null || list.size() < 1 || code.equals(groupCode)){
            return groupUserVO;
        }
        for (GroupVisible groupVisible :list){
            String visibleCode = groupVisible.getVisibleCode();
            if (visibleCode.equals(groupCode)){
                return groupUserVO;
            }
        }
        return null;
    }

    /**
     * 批量添加可见组织机构
     */
    public void addGroupVisible(GroupVisible groupVisible){
        String groupCode = groupVisible.getGroupCode();
        groupVisibleRepository.deleteByGroupCode(groupCode);
        List<String> visibleCodes = groupVisible.getVisibleCodes();
        if (visibleCodes!=null) {
            for (String visibleCode : visibleCodes) {
                GroupVisible groupVis=new GroupVisible();
                groupVis.setGroupCode(groupCode);
                groupVis.setVisibleCode(visibleCode);
                groupVisibleRepository.save(groupVis);
            }
        }
    }

    public List<UserVO> getVisibleUser(String groupCode){
        List<UserVO> list = new ArrayList<>();
        GroupUserVO visibleTree = getVisibleTree(groupCode);
        if(visibleTree == null){
            return list;
        }
        List<GroupUserVO> codeList = new ArrayList<>();
        getVisibleCode(visibleTree, groupCode, codeList);

        for (GroupUserVO item : codeList) {
            List<UserVO> voList = groupService.getUsers(item.getId());
            for (UserVO userVO : voList) {
                userVO.setGroupName(item.getLabel());
            }
            list.addAll(voList);
        }
        return list;
    }

    public void getVisibleCode(GroupUserVO vo, String groupCode, List<GroupUserVO> codeList){
        List<GroupVisible> list = groupVisibleRepository.findByGroupCode(vo.getId());
        //如果可见表中没有该groupcode表示该group对所有人可见, 对自己也可见
        if (list == null || list.size() < 1 || vo.getId().equals(groupCode)){
            codeList.add(vo);
        }else{
            for (GroupVisible groupVisible :list){
                String visibleCode = groupVisible.getVisibleCode();
                if (visibleCode.equals(groupCode)){
                    codeList.add(vo);
                }
            }
        }
        if(vo.getChildren() != null && vo.getChildren().size() > 0){
            for (GroupUserVO child : vo.getChildren()) {
                getVisibleCode(child, groupCode, codeList);
            }
        }
    }

}
