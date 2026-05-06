package com.ai.portal.gateway.filter;

import com.ai.portal.common.constant.AuthConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Slf4j
@Component
public class AccessLoggingFilter implements GlobalFilter, Ordered {

    @Autowired
    private ReactiveStringRedisTemplate redisTemplate;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getPath().pathWithinApplication().value();
        String method = request.getMethod().name();
        String apiKey = request.getHeaders().getFirst(AuthConstants.HEADER_API_KEY);
        long startTime = System.currentTimeMillis();

        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            long duration = System.currentTimeMillis() - startTime;
            Integer statusCode = null;
            if (exchange.getResponse().getStatusCode() != null) {
                statusCode = exchange.getResponse().getStatusCode().value();
            }
            
            log.info("Access Log: [ClientKey: {}] {} {} - Status: {} - Time: {}ms", 
                apiKey != null ? apiKey : "ANONYMOUS", 
                method, 
                path, 
                statusCode, 
                duration);

            // 写入 Redis 统计指标 (解耦主链路，Fire and Forget)
            String today = LocalDate.now().format(DATE_FORMATTER);
            String finalApiKey = (apiKey != null) ? apiKey : "ANONYMOUS";
            
            String systemTopKey = String.format("stats:system:top:%s", today);
            String apiTopKey = String.format("stats:api:top:%s", today);

            redisTemplate.opsForZSet().incrementScore(systemTopKey, finalApiKey, 1)
                    .then(redisTemplate.opsForZSet().incrementScore(apiTopKey, path, 1))
                    .timeout(Duration.ofMillis(500)) // 500ms 超时保护
                    .subscribeOn(Schedulers.boundedElastic()) // 切换到弹性线程池进行 I/O
                    .doOnError(e -> log.error("Redis stats update failed: {}", e.getMessage()))
                    .subscribe(); // 异步订阅，不阻塞主流程
        }));
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
