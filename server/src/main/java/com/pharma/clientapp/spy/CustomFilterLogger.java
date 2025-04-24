package com.pharma.clientapp.spy;

import com.p6spy.engine.spy.appender.StdoutLogger;

public class CustomFilterLogger extends StdoutLogger {
    // Добавьте сюда любые ключевые слова для фильтрации
    private static final String[] KEYWORDS = {"debitorka"}; // Можно расширить список

    @Override
    public void logText(String text) {
        if (text == null) return;
        String lower = text.toLowerCase();

        // Извлечь executionTime (число перед "ms|")
        int msIdx = lower.indexOf("ms|");
        long execTime = -1;
        if (msIdx > 0) {
            int pipeIdx = lower.lastIndexOf('|', msIdx - 1);
            if (pipeIdx >= 0) {
                String msStr = lower.substring(pipeIdx + 1, msIdx).replaceAll("[^0-9]", "");
                try { execTime = Long.parseLong(msStr); } catch (Exception ignored) {}
            }
        }

        // Проверка по ключевым словам
        boolean matchesKeyword = false;
        for (String kw : KEYWORDS) {
            if (lower.contains(kw)) {
                matchesKeyword = true;
                break;
            }
        }

        // Логировать если (долгий пользовательский) или (совпадает по ключу)
        if ((execTime >= 500) || matchesKeyword) {
            super.logText(text);
        }
    }
}
