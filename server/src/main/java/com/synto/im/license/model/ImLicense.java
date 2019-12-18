package com.synto.im.license.model;

import com.synto.core.jpa.SyntoEntity;
import com.synto.crypto.util.HashUtil;
import lombok.Data;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.*;
import java.util.Date;

/**
 * 授权文件实体类
 */
@Entity
@Table(name = "im_license", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"license_id"})
})
@Data
@Slf4j
public class ImLicense extends SyntoEntity {

    /**
     * id
     */
    @Column(name = "license_id", length = 64  )
    String licenseId;
    /**
     * 过期时间
     */
    @Column(name = "expired_date",length = 32)
    String expiredDate;
    /**
     * 用户数
     */
    @Column(name = "user_count")
    Long userCount;
    /**
     * 组织机构名
     */
    @Column(name = "group_name",length = 32    )
    String groupName;
    /**
     * 组织机构码
     */
    @Column(name = "group_code",length = 32 )
    String groupCode;
    /**
     * 发布时间
     */
    @Column(name = "release_date",length = 32 )
    String releaseDate;
    /**
     * 键
     */
    @Column(name = "hash_key",length = 64)
    String key;
    /**
     * 添加时间
     */
    @Column(name = "imported_date",length = 32 )
    String importedDate;

    /**
     * 是否使用
     */
    @Column(name = "used")
    boolean used = false;

    /**
     * 有效期  默认为1年
     */
    @Transient
    int period = 1;


    public String info() {
        return String.format("licenseId: %s, expiredDate: %s, userCount: %d, group name: %s, group code: %s, releaseDate: %s", this.licenseId, this.expiredDate, this.userCount, this.groupName, this.groupCode, this.releaseDate);
    }

    // 判断hash值是否相等
    public void valid() {
        log.info("（＾∀＾●）ﾉｼ com.synto.im.license.model.ImLicense：valid方法 " + this.info());
        String hash = HashUtil.hash(this.info());
        if (!this.key.equals(hash)) {
            throw new InvalidLicenseException(" GroupLicense " + this.licenseId + ", hash inconsistance");
        }
    }

    @Override
    public String toString() {
        return "ImLicense{" +
                "licenseId='" + licenseId + '\'' +
                ", expiredDate='" + expiredDate + '\'' +
                ", userCount=" + userCount +
                ", groupName='" + groupName + '\'' +
                ", groupCode='" + groupCode + '\'' +
                ", releaseDate='" + releaseDate + '\'' +
                ", key='" + key + '\'' +
                ", importedDate='" + importedDate + '\'' +
                ", used=" + used +
                ", period=" + period +
                '}';
    }
}
