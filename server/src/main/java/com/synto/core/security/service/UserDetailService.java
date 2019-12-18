package com.synto.core.security.service;

import com.synto.core.security.rs.UserInfo;
import com.synto.um.admin.model.UserAdmin;

public interface UserDetailService {

    UserInfo findUser(String username) throws RuntimeException;

    UserAdmin findUserAdminMessage(String username);

    void logout(UserInfo userInfo);

}
