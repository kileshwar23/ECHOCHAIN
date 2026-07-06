package com.ecochain.ecochain.exception;

/**
 * Thrown when a request contains invalid business logic (e.g. cancelling a non-PENDING request).
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
