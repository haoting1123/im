package com.synto.um.query;

import com.synto.um.query.model.OfProperty;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;

@Mapper
@Component
public interface OfPropertyQuery {
    @Select("select name, propValue, encrypted, iv from Ofproperty where name=#{name} ")
    OfProperty findFirstByName(@Param("name") String name);
}
