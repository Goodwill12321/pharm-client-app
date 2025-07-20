package com.pharma.clientapp.config;

import com.pharma.clientapp.logging.HotReloadEventLog;

//import io.micrometer.common.lang.NonNull;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collections;

@Component
public class HotReloadLogger implements ApplicationListener<ApplicationReadyEvent> {
    
    private static final Logger logger = LoggerFactory.getLogger(HotReloadLogger.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static boolean firstStart = true;

    @Autowired
    private Environment env;
    
    @Override
    public void onApplicationEvent(@NonNull ApplicationReadyEvent event) {
        // Проверяем, активен ли dev-профиль (любой dev*)
        boolean isDev = Arrays.stream(env.getActiveProfiles()).anyMatch(p -> p.startsWith("dev"));
        if (!isDev) {
            return;
        }
        String timestamp = LocalDateTime.now().format(formatter);
        if (firstStart) {
            logger.info("🚀 HOT RELOAD LOGGER: Приложение ЗАПУЩЕНО в {}", timestamp);
            HotReloadEventLog.logEvent("START", Collections.emptyList());
            firstStart = false;
        } else {
            logger.info("🔥 HOT RELOAD EVENT: Приложение ПЕРЕЗАПУЩЕНО в {}", timestamp);
            HotReloadEventLog.logEvent("AFTER_RESTART", Collections.emptyList());
        }
        logger.info("🔥 DevTools активен: {}", isDevToolsEnabled());
        logger.info("🔥 Polling интервал: {} сек", getPollingInterval());
        logger.info("🔥 Quiet период: {} сек", getQuietPeriod());
    }
    
    private boolean isDevToolsEnabled() {
        try {
            String devtoolsEnabled = System.getProperty("spring.devtools.restart.enabled");
            return devtoolsEnabled == null || Boolean.parseBoolean(devtoolsEnabled);
        } catch (Exception e) {
            return true; // По умолчанию включен в dev режиме
        }
    }
    
    private String getPollingInterval() {
        try {
            return System.getProperty("spring.devtools.restart.poll-interval", "1");
        } catch (Exception e) {
            return "1";
        }
    }
    
    private String getQuietPeriod() {
        try {
            return System.getProperty("spring.devtools.restart.quiet-period", "0.5");
        } catch (Exception e) {
            return "0.5";
        }
    }
} 