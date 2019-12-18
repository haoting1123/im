package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;

/**
 * 公告
 */
@Entity
@Table(name="um_notice")
@Getter
@Setter
public class Notice extends SyntoEntity{
    @Column(name="title",length = 256)
    private String title;

    @Lob
    @Basic(fetch= FetchType.LAZY)
    @Column(name="content")
    private String content;

    // 创建时间     nullable true
    @Column(name="create_time", nullable = true, updatable = false)
    @CreationTimestamp
    Date createTime;

    //可查看范围（用户，组织）
    @Lob
    @Column(name="organize_codes",  nullable = true, updatable = false)
    String organizeInfo;

    //可查看范围（用户，组织）
    @Transient
    @Deprecated
    String scope;

    //用户或组织codes
    String codes;

}
