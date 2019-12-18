package com.synto.openfire.client;

import com.synto.um.query.OfPropertyQuery;
import com.synto.um.query.model.OfProperty;
import org.igniterealtime.restclient.RestApiClient;
import org.igniterealtime.restclient.RestClient;
import org.igniterealtime.restclient.entity.AuthenticationToken;
import org.igniterealtime.restclient.enums.SupportedMediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "openfire")
public class OpenfireClient {
    @Autowired
    OfPropertyQuery ofPropertyQuery;

    private AuthenticationToken authenticationToken;
    private static RestApiClient restApiClient;
    private static RestClient restClient;

    private String url;
    private int port;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public RestApiClient getRestApiClient(){
        if(restApiClient == null){
            initApiClient();
        }
        return restApiClient;
    }

    public RestClient getRestClient(){
        if(restClient == null){
            initClient();
        }
        return restClient;
    }

    private void initApiClient(){
        initAuthToken();
        restApiClient = new RestApiClient(url, port, authenticationToken);
    }

    private void initClient(){
        initAuthToken();
        restClient = (new RestClient.RestClientBuilder(url + ":" + port)).authenticationToken(authenticationToken).connectionTimeout(5000).mediaType(SupportedMediaType.XML).build();
    }

    private void initAuthToken () {
        if(authenticationToken == null){
            OfProperty ofProperty = ofPropertyQuery.findFirstByName("plugin.restapi.secret");
            authenticationToken = new AuthenticationToken(ofProperty.getPropValue());
        }
    }


}
