package com.synto.um.service;

import com.synto.um.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ResourceService {

    @Autowired
    ResourceRepository resourceRepository;
}
