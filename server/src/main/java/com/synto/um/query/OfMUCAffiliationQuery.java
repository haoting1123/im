package com.synto.um.query;

import com.synto.um.query.model.OfMUCAffiliation;
import com.synto.um.query.model.OfMUCMember;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface OfMUCAffiliationQuery {

    @Select("select roomID from ofmucaffiliation where jid = #{jid}")
    List<Long> findByJid(@Param("jid") String jid);

    @Select("select jid, affiliation, nickname from ofmucaffiliation where roomid = #{roomId}")
    List<OfMUCAffiliation> findByRoomId(@Param("roomId") Long roomId);

    @Update("update ofmucaffiliation set nickname=#{nickname} where jid=#{jid} and roomID=#{roomId} ")
    int updateNicknameByJidAndRoomId(@Param("roomId") Long roomId, @Param("jid") String jid, @Param("nickname") String nickname);


}
