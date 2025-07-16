package com.pharma.clientapp.logging;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.pattern.ClassicConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;

public class LevelColorConverter extends ClassicConverter {

    @Override
    public String convert(ILoggingEvent event) {
        Level level = event.getLevel();
        switch (level.toInt()) {
            case Level.ERROR_INT:
                return "\u001b[31m" + level.toString() + "\u001b[0m"; // красный
            case Level.WARN_INT:
                return "\u001b[33m" + level.toString() + "\u001b[0m"; // желтый/оранжевый
            case Level.INFO_INT:
                return "\u001b[32m" + level.toString() + "\u001b[0m"; // зеленый
            case Level.DEBUG_INT:
                return "\u001b[34m" + level.toString() + "\u001b[0m"; // синий
            default:
                return level.toString();
        }
    }
} 