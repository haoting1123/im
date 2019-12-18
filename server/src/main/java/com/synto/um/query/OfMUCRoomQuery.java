package com.synto.um.query;

import com.synto.um.query.model.OfMUCRoom;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Component;

@Mapper
@Component
public interface OfMUCRoomQuery {

    @Select("select roomID, name, naturalName, description from ofmucroom where roomid = #{roomId}")
    OfMUCRoom findByRoomId(@Param("roomId") Long roomId);

    @Select("select roomID, name, naturalName, description from ofmucroom where name = #{name}")
    OfMUCRoom findByName(@Param("name") String name);

    @Update("update ofmucroom set naturalName=#{naturalName} where name=#{name} ")
    int updateNaturalNameByName(@Param("name") String name, @Param("naturalName") String naturalName);

}
