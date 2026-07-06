package com.ecochain.ecochain.exception;

/**
 * Thrown when a unique resource already exists (e.g. duplicate email on registration).
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}
