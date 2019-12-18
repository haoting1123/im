package com.synto.um.service;

import com.synto.um.repository.OperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OperationService {

    @Autowired
    OperationRepository operationRepository;
}
