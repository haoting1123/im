package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "um_user_config")
@Getter
@Setter
public class UserConfig extends SyntoEntity {

    @Column(name = "username",length = 128)
    String username;

    //是否存储日志，0不存储，1存储
    @Column(name = "chat_log_storage")
    String chatLogStorage;

    // 上传的文件累计大小
    @Column(name = "storage_file_up_size")
    Double storageFileUpSize;


}
