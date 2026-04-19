package com.ai.portal.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class AccessLoggingFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getPath().pathWithinApplication().value();
        String method = request.getMethod().name();
        String apiKey = request.getHeaders().getFirst("X-API-KEY");
        long startTime = System.currentTimeMillis();

        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            long duration = System.currentTimeMillis() - startTime;
            Integer statusCode = exchange.getResponse().getStatusCode() != null 
                ? exchange.getResponse().getStatusCode().value() 
                : null;
            
            log.info("Access Log: [ClientKey: {}] {} {} - Status: {} - Time: {}ms", 
                apiKey != null ? apiKey : "ANONYMOUS", 
                method, 
                path, 
                statusCode, 
                duration);
        }));
    }

    @Override
    public int getOrder() {
        // 设置为最高优先级，确保能记录到所有请求（包括内部 Controller）
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
