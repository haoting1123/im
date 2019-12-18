package com.synto.um.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.um.model.Group;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 组织机构数据库表交互方法
 */
@Repository
public interface GroupRepository extends SyntoRepository<Group> {

    /**
     * 查询全部组织机构信息
     *
     * @return
     */
    List<Group> findAll();

    List<Group> findByCode(String code);

    /**
     * 根据组织机构代码查询已有机构数
     *
     * @param code
     * @return
     */
    int countByCode(String code);

    List<Group> findByCode(String code, Sort sort);

    /**
     * 获取所有非直属机构根节点根据ParentCode
     *
     * @param parentCode
     * @return
     */
    List<Group> findByParentCode(String parentCode);

    /**
     * 获取所有非直属机构根节点根据ParentCode和GroupName(模糊查询)
     * 2019/12/6 修改
     *
     * @param userName
     * @param code
     * @return
     */
    List<Group> findByParentCodeAndGroupNameLike(String userName, String code);

    List<Group> findBySuperiorCode(String superiorCode);


    List<Group> findByParentCodeOrSuperiorCode(String parentCode, String superiorCode, Sort sort);

    List<Group> findByParentCodeOrSuperiorCode(String parentCode, String superiorCode);


    /**
     * 查找所有
     *
     * @param code
     * @param pageable
     * @return
     */
    //Page findByParentCodeOrderBySuperiorCodeAscGroupNameAsc(String code, Pageable pageable);

    /**
     * 根据GroupName(模糊查询)和ParentCode查询全部组织机构信息
     * 2019/12/6 修改
     *
     * @param userName
     * @param code
     * @param pageable
     * @return
     */
    //Page findByParentCodeAndGroupNameLikeOrderBySuperiorCodeAscGroupNameAsc(String code, String userName, Pageable pageable);

    /**
     * 添加查询条件
     * @param specification
     * @param pageable
     * @return
     */
    Page findAll(Specification<Group> specification, Pageable pageable);

    @Modifying
    @Transactional
    @Query("update Group set parentCode=?1 where parentCode=?2")
    void updateParentCode(String newCode, String oldCode);

    @Modifying
    @Transactional
    @Query("update Group set superiorCode=?1 where superiorCode=?2")
    void updateSuperiorCode(String newCode, String oldCode);

    @Modifying
    @Transactional
    @Query("update Group set serviceLicense=?1 where code=?2")
    void updateServiceLicense(String license, String code);
}
