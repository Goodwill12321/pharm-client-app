package com.pharma.clientapp.filter;

import com.pharma.clientapp.context.RequestContext;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(1)
public class RequestContextFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            // Устанавливаем IP-адрес клиента
            String ip = getClientIp((HttpServletRequest) request);
            RequestContext.setCurrentIp(ip);
            
            // Здесь можно добавить извлечение пользователя из токена, если нужно
            // String username = extractUsernameFromRequest((HttpServletRequest) request);
            // RequestContext.setCurrentUser(username);
            
            chain.doFilter(request, response);
        } finally {
            // Очищаем контекст после обработки запроса
            RequestContext.clear();
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
