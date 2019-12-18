package com.synto.um.query;

import com.synto.um.query.model.OfVcard;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

@Mapper
@Component
public interface OfVcardQuery {

    @Select("select username,vcard from ofvcard where username=#{username} ")
    OfVcard findFirstByUsername(@Param("username") String username);

    @Insert("insert into ofvcard (username, vcard) values (#{username}, #{vcard})")
    int insertOfVcard(@Param("username") String username, @Param("vcard") String vcard);

    @Update("update ofvcard set vcard=#{vcard} where username=#{username} ")
    int updateOfVcard(@Param("username") String username, @Param("vcard") String vcard);

    @Delete("delete from ofvcard where username=#{username}")
    int deleteOfVcard(@Param("username") String username);
}
