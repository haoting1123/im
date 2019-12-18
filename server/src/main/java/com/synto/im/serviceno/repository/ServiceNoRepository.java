package com.synto.im.serviceno.repository;

import com.synto.core.jpa.SyntoRepository;
import com.synto.im.serviceno.model.ServiceNo;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceNoRepository extends SyntoRepository<ServiceNo> {
    List<ServiceNo> findByGroupRootCode(String code);
    ServiceNo findFirstByCode(String code);

    @Query("select s from ServiceNo s, ServiceNoUser u  where s.code =u.serviceCode and s.groupRootCode=:gcode and u.username =:username ")
    List<ServiceNo> findByGroupRootCodeAndUsername(@Param("gcode")String gcode, @Param("username") String username);

}
