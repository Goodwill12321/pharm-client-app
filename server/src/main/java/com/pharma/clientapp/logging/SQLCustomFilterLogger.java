package com.pharma.clientapp.logging;
//import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
import com.p6spy.engine.spy.appender.Slf4JLogger;


//import java.util.regex.Matcher;
//import java.util.regex.Pattern;

public class SQLCustomFilterLogger extends Slf4JLogger {
    // Добавьте сюда любые ключевые слова для фильтрации
    private static final String[] KEYWORDS = {"debitorka", "insert", "update", "delete"}; // Можно расширить список
    //private static final Logger log = LoggerFactory.getLogger(SQLCustomFilterLogger.class);
 
     // Паттерн bcrypt-хэша: $2a$, $2b$, $2y$ + cost + 53 символа
    //private static final Pattern BCRYPT_PATTERN =
    //        Pattern.compile("\\$2[aby]\\$[0-9]{2}\\$[A-Za-z0-9./]{53}");

     static {
        //System.out.println("P6SPY DEBUG: SQLCustomFilterLogger static init");
    }

    public SQLCustomFilterLogger() {
        super();
        //System.out.println("P6SPY DEBUG: SQLCustomFilterLogger constructor called");
    }

    //private static final Pattern BCRYPT_PATTERN =
      //      Pattern.compile("\\$2[aby]\\$[0-9]{2}\\$[A-Za-z0-9./]+");

    @Override
    public void logText(String text) {
        if (text == null) return;

        // 1. Маскируем bcrypt-хэши в resultset-строках
        // Пример строки:
        // ...|resultset|connection -1|2 = false, ..., 11 = '$2a$12$MuQG70K3...'
       // if (text.contains("|resultset|")) {
       //     text = BCRYPT_PATTERN.matcher(text).replaceAll("*****");
       // }
       System.out.println("P6SPY DEBUG: text='" + text + "'");

        if (text.contains("|resultset|")) {
           /*  // Грубая проверка – есть ли вообще подпись bcrypt
            boolean containsMarker = text.contains("$2a$") || text.contains("$2b$") || text.contains("$2y$");

            Matcher matcher = BCRYPT_PATTERN.matcher(text);
            boolean found = matcher.find();

            // Временный отладочный лог
            System.out.println("P6SPY DEBUG: resultset line, containsMarker=" + containsMarker +
                ", regexFound=" + found +
                ", snippet=" + (text.length() > 120 ? text.substring(0, 120) + "..." : text));

            if (found) {
                String before = text;
                text = matcher.replaceAll("*****");
                System.out.println("P6SPY DEBUG: masked bcrypt, before='" + before + "', after='" + text + "'");
            }*/
           return;
        }


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

        // Логировать если (долгий запрос >= 500ms) или (совпадает по ключу)
        if ((execTime >= 500) || matchesKeyword) {
            super.logText(text);
        }
    }
}