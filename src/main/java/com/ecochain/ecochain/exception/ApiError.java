package com.ecochain.ecochain.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standard error response structure returned by all API endpoints on failure.
 */
@Data
@Builder
public class ApiError {

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    private int status;
    private String error;
    private String message;
    private String path;

    // Only populated for validation errors (field-level)
    private Map<String, String> fieldErrors;
}
