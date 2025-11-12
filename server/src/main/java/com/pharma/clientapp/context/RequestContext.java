package com.pharma.clientapp.context;

public class RequestContext {
    private static final ThreadLocal<String> currentUser = new ThreadLocal<>();
    private static final ThreadLocal<String> currentIp = new ThreadLocal<>();

    public static void setCurrentUser(String username) {
        currentUser.set(username);
    }

    public static String getCurrentUser() {
        return currentUser.get();
    }

    public static void setCurrentIp(String ip) {
        currentIp.set(ip);
    }

    public static String getCurrentIp() {
        return currentIp.get();
    }

    public static void clear() {
        currentUser.remove();
        currentIp.remove();
    }
}
