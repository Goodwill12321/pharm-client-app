package com.pharma.clientapp.controller;

import com.pharma.clientapp.logging.HotReloadEventLog;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/hot-reload-info")
public class HotReloadTestController {
    
    //private static final Logger logger = LoggerFactory.getLogger(HotReloadTestController.class);
    
    @GetMapping("/history")
    public List<HotReloadEventLog.HotReloadEvent> getHistory(@RequestParam(value = "limit", required = false) Integer limit) {
        int n = (limit == null || limit <= 0) ? 10 : limit;
        return HotReloadEventLog.readLastEvents(n);
    }
} 