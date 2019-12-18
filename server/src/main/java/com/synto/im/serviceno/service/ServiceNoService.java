package com.synto.im.serviceno.service;

import com.synto.im.serviceno.model.ServiceNo;
import com.synto.im.serviceno.model.ServiceNoArticle;
import com.synto.im.serviceno.model.ServiceNoUser;
import com.synto.im.serviceno.repository.ServiceNoArticleRepository;
import com.synto.im.serviceno.repository.ServiceNoRepository;
import com.synto.im.serviceno.repository.ServiceNoUserRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceNoService {

    @Autowired
    ServiceNoRepository serviceNoRepository;
    @Autowired
    ServiceNoArticleRepository serviceNoArticleRepository;
    @Autowired
    ServiceNoUserRepository serviceNoUserRepository;

    public long save(ServiceNo serviceNo){
        ServiceNo sno = serviceNoRepository.findFirstByCode(serviceNo.getCode());
        if(sno != null){
            return -1;
        }
        return serviceNoRepository.save(serviceNo).getId();
    }

    public Page<ServiceNoArticle> articleList(int page, int size, String gcode, String title){
        List<ServiceNo> snList = serviceNoRepository.findByGroupRootCode(gcode);
        List<String> scodeList = snList.stream().map(ServiceNo::getCode).collect(Collectors.toList());

        Sort sort = new Sort(Sort.Direction.DESC, "createDate");
        Pageable pageRequest = PageRequest.of(page - 1, size, sort);
        Page<ServiceNoArticle> p = null;
        if(StringUtils.isNotBlank(title)){
            p = serviceNoArticleRepository.findByServiceCodeInAndTitleContaining(scodeList, title, pageRequest);
        }else{
            p = serviceNoArticleRepository.findByServiceCodeIn(scodeList, pageRequest);
        }

        p.getContent().stream().forEach(item -> {
            item.setServiceName(serviceNoRepository.findFirstByCode(item.getServiceCode()).getName());
        });

        return  p;
    }

    public int savaUser(String serviceCode, List<String> usernames){
        List<ServiceNoUser> list = new ArrayList<>();
        for (String s : usernames) {
            ServiceNoUser gsp = new ServiceNoUser();
            gsp.setServiceCode(serviceCode);
            gsp.setUsername(s);
            list.add(gsp);
        }
        serviceNoUserRepository.deleteByServiceCode(serviceCode);
        serviceNoUserRepository.saveAll(list);
        return 1;
    }
}
