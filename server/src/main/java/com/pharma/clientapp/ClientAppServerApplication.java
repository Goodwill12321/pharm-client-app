package com.pharma.clientapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.LoggerFactory;
import ch.qos.logback.classic.Logger;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.env.PropertySource;
import org.springframework.core.env.ConfigurableEnvironment;

@SpringBootApplication
public class ClientAppServerApplication {
    @Autowired
    private Environment env;

    public static void main(String[] args) {
        //System.out.println("CLASSPATH: " + System.getProperty("java.class.path"));
        //System.out.println("JAVA_HOME: " + System.getenv("JAVA_HOME"));
        SpringApplication.run(ClientAppServerApplication.class, args);
    }

    @PostConstruct
    public void printLogLevels() {
        Logger springLogger = (Logger) LoggerFactory.getLogger("org.springframework");
        Logger rootLogger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        Logger yourLogger = (Logger) LoggerFactory.getLogger("com.pharma.clientapp");

        System.out.println("Spring logger level: " + springLogger.getEffectiveLevel());
        System.out.println("Root logger level: " + rootLogger.getEffectiveLevel());
        System.out.println("Your app logger level: " + yourLogger.getEffectiveLevel());

        // Выводим значения переменных окружения и properties
        String[] keys = {
            "logging.level.root",
            "logging.level.com.pharma.clientapp",
            "spring.profiles.active",
            "ROOT_LOG_LEVEL"
        };
        for (String key : keys) {
            String value = env.getProperty(key);
            System.out.println(key + " = " + value + " (source: " + findPropertySource(key) + ")");
        }
    }

    // Метод для поиска источника property
    private String findPropertySource(String key) {
        if (env instanceof ConfigurableEnvironment configurableEnvironment) {
            for (PropertySource<?> ps : configurableEnvironment.getPropertySources()) {
                Object value = ps.getProperty(key);
                if (value != null) {
                    return ps.getName();
                }
            }
        }
        return "not found";
    }
}
