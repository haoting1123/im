package com.synto.um.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name="um_notice_scope")
@Getter
@Setter
public class NoticeScope extends SyntoEntity {

    @Column(name = "notice_id")
    Long noticeId;

    @Column(name = "scope",length = 128)
    String scope;

    @Lob
    @Basic(fetch= FetchType.LAZY)
    @Column(name="codes")
    String codes;
}
