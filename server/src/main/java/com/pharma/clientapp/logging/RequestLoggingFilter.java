package com.pharma.clientapp.logging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import com.pharma.clientapp.context.RequestContext;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {
    private static final Logger httpLogger = LoggerFactory.getLogger("com.pharma.clientapp.http");

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        long start = System.currentTimeMillis();
        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - start;
            httpLogger.info("{} {} [{}] from {} user={} ({} ms)",
                request.getMethod(),
                request.getRequestURI(),
                response.getStatus(),
                request.getRemoteAddr(),
                Optional.ofNullable(RequestContext.getCurrentUser()).orElse("unauthenticated"),
                duration
            );
        }
    }
}