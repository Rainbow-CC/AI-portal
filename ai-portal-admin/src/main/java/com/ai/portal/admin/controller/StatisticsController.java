package com.ai.portal.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/stats")
public class StatisticsController {

    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");

    @GetMapping("/top-systems")
    public List<StatItem> getTopSystems() {
        String today = LocalDate.now().format(DATE_FORMATTER);
        String key = "stats:system:top:" + today;
        return getTop10FromRedis(key);
    }

    @GetMapping("/top-apis")
    public List<StatItem> getTopApis() {
        String today = LocalDate.now().format(DATE_FORMATTER);
        String key = "stats:api:top:" + today;
        
        // 获取较多数据（如前100），以便过滤后仍有足够数据展示
        Set<ZSetOperations.TypedTuple<String>> topItems = redisTemplate.opsForZSet()
                .reverseRangeWithScores(key, 0, 99);

        if (topItems == null || topItems.isEmpty()) {
            return new ArrayList<>();
        }

        return topItems.stream()
                .filter(tuple -> {
                    String path = tuple.getValue();
                    return path != null && !path.startsWith("/api/admin/") && !path.startsWith("/actuator/");
                })
                .limit(10)
                .map(tuple -> new StatItem(tuple.getValue(), tuple.getScore().intValue()))
                .collect(Collectors.toList());
    }

    private List<StatItem> getTop10FromRedis(String key) {
        Set<ZSetOperations.TypedTuple<String>> topItems = redisTemplate.opsForZSet()
                .reverseRangeWithScores(key, 0, 9);

        if (topItems == null || topItems.isEmpty()) {
            return new ArrayList<>();
        }

        return topItems.stream()
                .map(tuple -> new StatItem(tuple.getValue(), tuple.getScore().intValue()))
                .collect(Collectors.toList());
    }

    public static class StatItem {
        private String name;
        private int value;

        public StatItem(String name, int value) {
            this.name = name;
            this.value = value;
        }

        public String getName() { return name; }
        public int getValue() { return value; }
    }
}
