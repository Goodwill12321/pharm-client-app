package com.pharma.clientapp.logging;

import java.io.*;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

public class HotReloadEventLog {
    //private static final String LOG_FILE = "logs/hot-reload-events.log";
    private static final String LOG_FILE = System.getenv().getOrDefault("LOG_DIR", "logs") + "/hot-reload-events.log";
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static synchronized void logEvent(String type, List<String> files) {
        try {
            Files.createDirectories(Paths.get("logs"));
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(LOG_FILE, true))) {
                String timestamp = LocalDateTime.now().format(formatter);
                writer.write("[" + timestamp + "] " + type);
                writer.newLine();
                if (files != null && !files.isEmpty()) {
                    writer.write("Причина:");
                    writer.newLine();
                    for (String file : files) {
                        writer.write(" - " + file);
                        writer.newLine();
                    }
                }
            }
        } catch (IOException e) {
            // Не бросаем исключение, чтобы не мешать работе приложения
            e.printStackTrace();
        }
    }

    public static synchronized List<HotReloadEvent> readLastEvents(int limit) {
        List<HotReloadEvent> events = new ArrayList<>();
        try {
            if (!Files.exists(Paths.get(LOG_FILE))) return events;
            List<String> lines = Files.readAllLines(Paths.get(LOG_FILE));
            ListIterator<String> it = lines.listIterator(lines.size());
            List<String> buffer = new ArrayList<>();
            while (it.hasPrevious()) {
                String line = it.previous();
                buffer.add(line);
                if (line.matches("^\\[.*\\] (START|BEFORE_RESTART|AFTER_RESTART)$")) {
                    // Собрали одно событие
                    Collections.reverse(buffer);
                    HotReloadEvent event = parseEvent(buffer);
                    if (event != null) events.add(event);
                    buffer.clear();
                    if (events.size() >= limit) break;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        Collections.reverse(events);
        return events;
    }

    private static HotReloadEvent parseEvent(List<String> lines) {
        if (lines.isEmpty()) return null;
        String header = lines.get(0);
        String timestamp = header.substring(1, 20);
        String type = header.substring(22).trim();
        List<String> files = Collections.emptyList();
        if (lines.size() > 1 && lines.get(1).startsWith("Причина")) {
            files = lines.stream()
                    .skip(2) // skip header and "Причина:"
                    .map(s -> s.replaceFirst(" - ", ""))
                    .collect(Collectors.toList());
        }
        return new HotReloadEvent(timestamp, type, files);
    }

    public static class HotReloadEvent {
        public String timestamp;
        public String type;
        public List<String> files;
        public HotReloadEvent(String timestamp, String type, List<String> files) {
            this.timestamp = timestamp;
            this.type = type;
            this.files = files;
        }
    }
} 