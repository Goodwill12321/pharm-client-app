package com.pharma.clientapp.logging;

import com.pharma.clientapp.context.RequestContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10) // после security, но до большинства логов
public class MdcRequestContextFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String ip = Optional.ofNullable(RequestContext.getCurrentIp())
                .orElse(com.pharma.clientapp.util.IpUtils.getClientIp(request));

        String user = Optional.ofNullable(RequestContext.getCurrentUser())
                .orElse("unauthenticated");

        MDC.put("ip", ip);
        MDC.put("user", user);

        try {
            filterChain.doFilter(request, response);
        } finally {
            // сначала логируем всё, потом очищаем
            MDC.remove("ip");
            MDC.remove("user");
        }
    }
}