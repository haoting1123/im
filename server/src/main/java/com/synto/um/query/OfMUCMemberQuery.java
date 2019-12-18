package com.synto.um.query;

import com.synto.um.query.model.OfMUCMember;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Component;

import java.lang.reflect.Member;
import java.util.List;

@Mapper
@Component
public interface OfMUCMemberQuery {

    @Select("select roomID from ofmucmember where jid = #{jid}")
    List<Long> findByJid(@Param("jid") String jid);

    @Select("select jid,nickname from ofmucmember where roomid = #{roomId}")
    List<OfMUCMember> findByRoomId(@Param("roomId") Long roomId);

    @Update("update ofmucmember set nickname=#{nickname} where jid=#{jid} and roomID=#{roomId} ")
    int updateNicknameByJidAndRoomId(@Param("roomId") Long roomId, @Param("jid") String jid, @Param("nickname") String nickname);


}
