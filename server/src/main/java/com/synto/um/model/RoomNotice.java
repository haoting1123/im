package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;

/**
 * 群公告
 */
@Entity
@Table(name="um_room_notice")
@Getter
@Setter
public class RoomNotice extends SyntoEntity {

    @Column(name = "room_jid",length = 255)
    String roomJid;

    @Column(name = "user_name",length = 64)
    String userName;

    @Lob
    @Basic(fetch= FetchType.LAZY)
    @Column(name = "content")
    String content;

    @Column(name = "title",length = 256)
    String title;

    @Column(name = "create_time",updatable = false)
    @CreationTimestamp
    Date createTime;
}
