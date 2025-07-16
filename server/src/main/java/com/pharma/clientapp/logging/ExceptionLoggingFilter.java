package com.pharma.clientapp.logging;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ExceptionLoggingFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger("com.pharma.clientapp.errors");

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        try {
            chain.doFilter(request, response);
        } catch (Exception e) {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            logger.error("Исключение в фильтре: {} {} - {} - {}", 
                httpRequest.getMethod(), 
                httpRequest.getRequestURI(), 
                e.getClass().getSimpleName(), 
                e.getMessage(), 
                e);
            throw e;
        }
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Не требуется
    }

    @Override
    public void destroy() {
        // Не требуется
    }
} 