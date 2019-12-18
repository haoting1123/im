package com.synto.um.service;

import com.synto.um.admin.repository.SystemAdminLogRepository;
import com.synto.um.dao.GroupDao;
import com.synto.um.dao.RoleDao;
import com.synto.um.dao.UserDao;
import com.synto.um.model.Group;
import com.synto.um.model.User;
import com.synto.um.model.UserConfig;
import com.synto.um.model.vo.UserVO;
import com.synto.um.query.OfVcardQuery;
import com.synto.um.query.model.OfVcard;
import com.synto.um.repository.GroupRepository;
import com.synto.um.repository.UserConfigRepository;
import com.synto.um.repository.UserRepository;
import com.synto.util.DoubleUtil;
import com.synto.util.OpenfireUtil;
import com.synto.util.UserUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserConfigService {

    @Autowired
    UserConfigRepository userConfigRepository;

    public int save(UserConfig userConfig){
        UserConfig uc = userConfigRepository.findFirstByUsername(userConfig.getUsername());
        if(uc != null){
            userConfig.setId(uc.getId());
            userConfig.setStorageFileUpSize(uc.getStorageFileUpSize());
        }
        userConfigRepository.save(userConfig);
        return 0;
    }

    public int updateFileUpSize(String username, double size){
        UserConfig uc = userConfigRepository.findFirstByUsername(username);
        if(uc == null){
            uc = new UserConfig();
            uc.setUsername(username);
            uc.setChatLogStorage("0");
            uc.setStorageFileUpSize(0d);
        }
        if(uc.getStorageFileUpSize() == null){
            uc.setStorageFileUpSize(0d);
        }
        uc.setStorageFileUpSize(DoubleUtil.add(uc.getStorageFileUpSize(), size));
        userConfigRepository.save(uc);
        return 1;
    }

}
