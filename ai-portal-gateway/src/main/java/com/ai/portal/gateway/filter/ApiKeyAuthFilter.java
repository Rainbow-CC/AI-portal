package com.ai.portal.gateway.filter;

import com.ai.portal.common.constant.AuthConstants;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Set;

@Component
public class ApiKeyAuthFilter implements GlobalFilter, Ordered {

    // 模拟合法 API Key 列表，生产环境应从 Redis 或数据库读取
    private static final Set<String> VALID_KEYS = Set.of("portal-client-001", "test-key-123");

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().value();
        
        // 排除非业务接口（如健康检查）
        if (path.startsWith("/actuator/") || path.equals("/fallback")) {
            return chain.filter(exchange);
        }

        String apiKey = exchange.getRequest().getHeaders().getFirst(AuthConstants.HEADER_API_KEY);

        if (!StringUtils.hasText(apiKey) || !VALID_KEYS.contains(apiKey)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -100; // 在日志过滤器之前执行
    }
}
