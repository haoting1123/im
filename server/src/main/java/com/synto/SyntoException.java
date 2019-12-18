package com.synto;

public class SyntoException extends RuntimeException {
    public SyntoException() {
    }

    public SyntoException(String message) {
        super(message);
    }

    public SyntoException(String message, Throwable cause) {
        super(message, cause);
    }

    public SyntoException(Throwable cause) {
        super(cause);
    }

    public SyntoException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
