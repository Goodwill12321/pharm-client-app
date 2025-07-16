package com.pharma.clientapp.config;

import com.pharma.clientapp.logging.HotReloadEventLog;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.devtools.classpath.ClassPathChangedEvent;
import org.springframework.boot.devtools.filewatch.ChangedFile;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CustomRestartListener {
    private static final Logger logger = LoggerFactory.getLogger(CustomRestartListener.class);

    @Autowired
    private Environment env;

    @EventListener
    public void onClassPathChanged(ClassPathChangedEvent event) {
        // Работать только в dev-профилях
        boolean isDev = Arrays.stream(env.getActiveProfiles()).anyMatch(p -> p.startsWith("dev"));
        if (!isDev) {
            return;
        }
        // Собираем список изменённых файлов
        List<String> modifiedFiles = event.getChangeSet().stream()
            .flatMap(changedFiles -> changedFiles.getFiles().stream())
            .filter(changedFile -> changedFile.getType().equals(ChangedFile.Type.MODIFY))
            .map(changedFile -> changedFile.getFile().getAbsolutePath())
            .collect(Collectors.toList());
        if (!modifiedFiles.isEmpty()) {
            String filesList = modifiedFiles.stream().collect(Collectors.joining("\n - ", "\n - ", ""));
            logger.info("🔄 RESTART TRIGGERED: DevTools обнаружил изменения. Будет рестарт. Причина: изменены файлы:{}", filesList);
            HotReloadEventLog.logEvent("BEFORE_RESTART", modifiedFiles);
        }
    }
} 