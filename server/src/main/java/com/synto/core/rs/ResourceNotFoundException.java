package com.synto.core.rs;

public class ResourceNotFoundException extends RuntimeException {
    String uri;

    public ResourceNotFoundException(String uri) {
        this.uri = uri;
    }

    public ResourceNotFoundException(String uri, String message) {
        super(message);
        this.uri = uri;
    }

    public ResourceNotFoundException(String uri, String message, Throwable cause) {
        super(message, cause);
        this.uri = uri;
    }

    public ResourceNotFoundException(String uri, Throwable cause) {
        super(cause);
        this.uri = uri;

    }

    public ResourceNotFoundException(String uri, String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
        this.uri = uri;

    }

    public String getUri() {
        return uri;
    }
}
