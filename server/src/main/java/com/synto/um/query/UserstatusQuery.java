package com.synto.um.query;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

@Mapper
@Component
public interface UserstatusQuery {

    @Select("select count(1) from userstatus where username=#{username} and online=#{online} ")
    int findCountByUsernameAndOnline(@Param("username") String username, @Param("online") int online);

}
