package com.synto.um.service;

import com.synto.um.model.ClientVersion;
import com.synto.um.model.vo.ClientVersionVO;
import com.synto.um.repository.ClientVersionRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
@Component
@ConfigurationProperties(prefix = "im.version")
public class ClientVersionService {
    private final String DEFAULT_VERSION = "1.0.0";

    @Autowired
    ClientVersionRepository clientVersionRepository;

    private String server;
    private String softwarecenter;

    public String getSoftwarecenter() {
        return softwarecenter;
    }

    public void setSoftwarecenter(String softwarecenter) {
        this.softwarecenter = softwarecenter;
    }

    public String getServer() {
        return server;
    }

    public void setServer(String server) {
        this.server = server;
    }

    public String findVersionNo(String os){
        if(StringUtils.isBlank(os)){
            return DEFAULT_VERSION;
        }
        ClientVersion cv = clientVersionRepository.findTopByClientTypeOrderByCreatedTimeDesc(os.toLowerCase());
        if(cv == null) {
            return DEFAULT_VERSION;
        }
        return cv.getClientVersion();
    }

    public String findVersionNo(String os, String network){
        if(StringUtils.isBlank(os) || StringUtils.isBlank(network)){
            return DEFAULT_VERSION;
        }
        ClientVersion cv = clientVersionRepository.findTopByClientTypeAndNetworkOrderByCreatedTimeDesc(os.toLowerCase(), network.toLowerCase());
        if(cv == null) {
            return DEFAULT_VERSION;
        }
        return cv.getClientVersion();
    }

    public ClientVersionVO findVersion(String os){
        ClientVersionVO vo = new ClientVersionVO();

        if(StringUtils.isBlank(os)){
            return vo;
        }

        os = os.toLowerCase();
        ClientVersion cv = clientVersionRepository.findTopByClientTypeOrderByCreatedTimeDesc(os);
        if(cv == null) {
            return vo;
        }

        String softName = softNameHandle(os, cv.getClientVersion());
        String updateUrl = String.format("%s/%s/%s/%s", softwarecenter, os, cv.getClientVersion(), softName);

        vo.setVersion(cv.getClientVersion());
        vo.setUpdateUrl(updateUrl);

        return vo;
    }

    public ClientVersionVO findVersion(String os, String network){
        ClientVersionVO vo = new ClientVersionVO();

        if(StringUtils.isBlank(os) || StringUtils.isBlank(network)){
            return vo;
        }

        os = os.toLowerCase();
        ClientVersion cv = clientVersionRepository.findTopByClientTypeAndNetworkOrderByCreatedTimeDesc(os, network);
        if(cv == null) {
            return vo;
        }

        String softName = softNameHandle(os, cv.getClientVersion());
        String updateUrl = String.format("%s/%s/%s/%s/%s", softwarecenter, os, network, cv.getClientVersion(), softName);

        vo.setVersion(cv.getClientVersion());
        vo.setUpdateUrl(updateUrl);

        return vo;
    }

    private String softNameHandle(String os, String version){
        String softName = "im_setup_" + version;
        String softSuffix = ".exe";
        if(os.equals("mips")){
            softSuffix = ".rpm.tar.gz";

        }else if(os.equals("android")){
            softSuffix = ".apk";

        }else if(os.equals("ios")){
            softSuffix = ".ipa";
        }
        return softName + softSuffix;
    }

}
