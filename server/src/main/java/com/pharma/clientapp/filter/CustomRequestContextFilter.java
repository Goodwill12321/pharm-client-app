package com.pharma.clientapp.filter;

import com.pharma.clientapp.context.RequestContext;
import com.pharma.clientapp.util.IpUtils;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(1)
public class CustomRequestContextFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            // Устанавливаем IP-адрес клиента
            String ip = IpUtils.getClientIp((HttpServletRequest) request);
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

    
}
