package com.synto.im.serviceno.model;

import com.synto.core.jpa.SyntoEntity;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.Date;

@Entity
@Table(name = "um_service_no_article")
@Getter
@Setter
public class ServiceNoArticle extends SyntoEntity {

    @Column(name = "service_code",length = 64)
    String serviceCode;

    @Column(name = "title",length = 256)
    String title;

    @Column(name = "url",length = 512)
    String url;

    @Column(name = "remark",length = 2000)
    String remark;

    @Column(name = "create_date", nullable = true, updatable = false)
    @CreationTimestamp
    Date createDate;

    @Transient
    String serviceName;

}
