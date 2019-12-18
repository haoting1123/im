package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 客户端配置
 */
@Entity
@Table(name="um_client_setting")
@Getter
@Setter
public class ClientSetting extends SyntoEntity {

    // 发送文件的后缀
    @Column(name="send_file_suffix")
    private String sendFileSuffix;

    // 发送文件的大小
    @Column(name="send_file_size")
    private Integer sendFileSize;

    // 文件存储空间大小(MB)
    @Column(name="storage_file_size")
    private Long storageFileSize;

    // 消息存储空间大小(万条)
    @Column(name="storage_msg_size")
    private Long storageMsgSize;

    // 消息存储单位 10000
    @Column(name="kb_msg_number")
    private Integer kbMsgNumber;

    @Override
    public String toString() {
        return "ClientSetting{" +
                "sendFileSuffix='" + sendFileSuffix + '\'' +
                ", sendFileSize=" + sendFileSize +
                ", storageFileSize=" + storageFileSize +
                ", storageMsgSize=" + storageMsgSize +
                ", kbMsgNumber=" + kbMsgNumber +
                '}';
    }
}
