package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "of_message_history")
@Getter
@Setter
public class OfMessageHistory extends SyntoEntity {

    //发送人operation
    @Column(name = "sender",length = 128)
    String sender;

    //接收人
    @Column(name = "receiver",length = 128)
    String receiver;

    //消息
    @Lob
    @Basic(fetch= FetchType.LAZY)
    @Column(name = "message")
    String message;

    //日期
    @Column(name = "created_time",updatable = false)
    Date time;
}
