package com.pharma.clientapp.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.pharma.clientapp.context.RequestContext;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Collections;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger("com.pharma.clientapp.errors");
    
    private String getClientIp() {
        return RequestContext.getCurrentIp();
    }

    private String getCurrentLogin() {
        return RequestContext.getCurrentUser() != null ? 
               RequestContext.getCurrentUser() : "unauthenticated";
    }

    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<Object> handleEntityNotFound(EntityNotFoundException ex) {
        String ip = getClientIp();
        String login = getCurrentLogin();
        log.error("Сущность не найдена: {} - {} | IP: {} | User: {}", 
            ex.getClass().getSimpleName(), ex.getMessage(), ip, login, ex);
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Object> handleIllegalArgument(IllegalArgumentException ex) {
        String ip = getClientIp();
        String login = getCurrentLogin();
        log.error("Некорректный аргумент: {} - {} | IP: {} | User: {}", 
            ex.getClass().getSimpleName(), ex.getMessage(), ip, login, ex);
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<Object> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        String ip = getClientIp();
        String login = getCurrentLogin();
        Throwable rootCause = ex.getRootCause();
        String message = "Data integrity violation: " + (rootCause != null ? rootCause.getMessage() : ex.getMessage());
        log.error("Нарушение целостности данных: {} - {} | IP: {} | User: {}", 
            ex.getClass().getSimpleName(), ex.getMessage(), ip, login, ex);
        return buildResponse(HttpStatus.CONFLICT, message);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Object> handleValidation(MethodArgumentNotValidException ex) {
        String ip = getClientIp();
        String login = getCurrentLogin();
        log.error("Ошибка валидации: {} - {} | IP: {} | User: {}", 
            ex.getClass().getSimpleName(), ex.getMessage(), ip, login, ex);
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Validation failed");
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            fieldErrors.put(error.getField(), error.getDefaultMessage())
        );
        body.put("fieldErrors", fieldErrors);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<Object> handleAuthenticationException(AuthenticationException ex) {
        String ip = getClientIp();
        String login = getCurrentLogin();
        log.error("Ошибка аутентификации: {} | IP: {} | User: {}", 
            ex.getMessage(), ip, login);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("error", ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<Object> handleAllOther(Exception ex) {
        String ip = getClientIp();
        String login = getCurrentLogin();
        log.error("Глобальная ошибка: {} - {} | IP: {} | User: {}", 
            ex.getClass().getSimpleName(), ex.getMessage(), ip, login, ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    private ResponseEntity<Object> buildResponse(HttpStatus status, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return new ResponseEntity<>(body, status);
    }
} 