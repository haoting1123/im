package com.synto.core.rs;

import lombok.extern.slf4j.Slf4j;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import java.io.Serializable;

@Slf4j
@Provider
public class ResourceExceptionMapper implements ExceptionMapper<ResourceNotFoundException> {

    @Override
    public Response toResponse(ResourceNotFoundException exception) {
        log.error("resource excepton", exception);
        return Response.ok(new ErrorResource("404", exception.getUri(), exception.getMessage()),
                MediaType.APPLICATION_JSON).build();
    }

    public static class ErrorResource implements Serializable {
        String uri;
        String msg;
        String code;

        public ErrorResource(String code, String uri, String msg) {
            this.code = code;
            this.uri = uri;
            this.msg = msg;
        }

        public String getUri() {
            return uri;
        }

        public String getMsg() {
            return msg;
        }

        public String getCode() {
            return code;
        }

        public void setUri(String uri) {
            this.uri = uri;
        }

        public void setMsg(String msg) {
            this.msg = msg;
        }

        public void setCode(String code) {
            this.code = code;
        }
    }

}
