package com.synto.core.rs.jersey;

import lombok.extern.slf4j.Slf4j;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Slf4j
@Provider
public class JerseyExceptionHandler implements ExceptionMapper<Exception> {

    @Override
    public Response toResponse(Exception e) {
        log.error("", e);
        return Response.status(getStatusCode(e))
                .entity(getEntity(e))
                .build();
    }

    /*
     * Get appropriate HTTP status code for an exception.
     */
    private int getStatusCode(Throwable exception) {
        if (exception instanceof WebApplicationException) {
            return ((WebApplicationException) exception).getResponse().getStatus();
        }
        return Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();
    }

    /*
     * Get response body for an exception.
     */
    private Object getEntity(Throwable exception) {
        return exception.getMessage();
    }

}
