package com.ai.portal.admin.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/ai")
public class TestController {

    @GetMapping("/hello")
    public String hello() {
        return "hello, spring cloud";
    }

    @GetMapping("/fast")
    public Map<String, Object> fast() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    @GetMapping("/slow")
    public Map<String, Object> slow(@RequestParam(defaultValue = "1000") long ms) throws InterruptedException {
        Thread.sleep(ms);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "slow_ok");
        response.put("delay", ms);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}
