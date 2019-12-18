package com.synto.im.openfire.query;

import com.synto.um.query.model.OfMUCConversationLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface OfMUCConversationLogQuery {

    @Select("SELECT l.SENDER, l.logtime, l.STANZA FROM ofmucconversationlog l, OFMUCROOM r WHERE l.ROOMID = r.ROOMID AND r.NAME = #{name} AND l.LOGTIME > #{logTime}  ORDER BY l.LOGTIME ASC ")
    List<OfMUCConversationLog> findByRoomIdAndTime(@Param("name") String name, @Param("logTime") Long logTime);


}
