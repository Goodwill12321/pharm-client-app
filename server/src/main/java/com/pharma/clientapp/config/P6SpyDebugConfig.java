package com.pharma.clientapp.config;

import com.p6spy.engine.spy.P6SpyLoadableOptions;
import com.p6spy.engine.spy.P6SpyOptions;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class P6SpyDebugConfig {

    private static final Logger log = LoggerFactory.getLogger(P6SpyDebugConfig.class);

    @PostConstruct
    public void logP6SpyAppender() {
        try {
            P6SpyLoadableOptions options = P6SpyOptions.getActiveInstance();
            Object appender = options.getAppenderInstance();
            log.info("P6SPY DEBUG: active appender = {}", 
                     appender != null ? appender.getClass().getName() : "null");
            log.info("P6SPY DEBUG: logMessageFormat = {}", options.getLogMessageFormat());
        } catch (Exception e) {
            log.error("P6SPY DEBUG: failed to log P6Spy appender", e);
        }
    }
}