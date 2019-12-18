package com.synto.im.license.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.im.license.model.ImLicense;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface ImLicenseRepository extends SyntoRepository<ImLicense> {

    List<ImLicense> findAll();

    List<ImLicense> findByGroupCodeOrderByIdDesc(String groupCode);

    List<ImLicense> findByGroupCodeAndImportedDateIsNotNullOrderByIdDesc(String groupCode);

    Optional<ImLicense> findByLicenseIdAndUsedIsAndImportedDateIsNull(String licenseId, boolean used);

    List<ImLicense> findByGroupCodeAndUsedIsAndImportedDateIsNull(String groupCode, boolean used);

    List<ImLicense> findByGroupCodeAndUsedIs(String groupCode, boolean used);

    Optional<ImLicense> findByLicenseId(String licenseId);

    @Transactional
    void deleteByGroupCodeAndUsedIs(String code, boolean used);

    @Transactional
    void deleteByGroupCode(String code);

    @Query("select sum(o.userCount) from ImLicense o where o.groupCode=:groupCode and o.expiredDate>:today and o.used= true ")
    Integer sumUserValidByGroup(@Param("groupCode") String groupCode, @Param("today") String today);

    //普通管理员
    @Query(nativeQuery=true,value = "select * from im_license where group_code=?1 and used=true order by imported_date desc limit 1")
    ImLicense getImLicense(String groupCode);

    // 超级管理员在管理端获取
    @Query(nativeQuery=true,value = "select * from im_license where group_code=?1 and used=true order by release_date desc limit 1")
    ImLicense getImLicenseManage(String groupCode);

}
