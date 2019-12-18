package com.synto.im.license.repository;

import com.synto.im.license.model.ImLicense;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

@Slf4j
@SpringBootTest
@RunWith(SpringRunner.class)
public class ImLicenseRepositoryTest {

    @Autowired
    ImLicenseRepository imLicenseRepository;


    @Test
    public void findAll() {
        List<ImLicense> imLicenses =  imLicenseRepository.findAll();
        for (ImLicense i: imLicenses) {
            log.info("=======" + i.toString());
        }
    }
}
