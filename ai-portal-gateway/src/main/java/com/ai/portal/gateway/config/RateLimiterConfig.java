package com.ai.portal.gateway.config;

import com.ai.portal.common.constant.AuthConstants;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimiterConfig {

    /**
     * 基于请求头中的 X-API-Key 进行限流
     */
    @Bean
    public KeyResolver apiKeyResolver() {
        return exchange -> Mono.justOrEmpty(exchange.getRequest().getHeaders().getFirst(AuthConstants.HEADER_API_KEY))
                .defaultIfEmpty("anonymous");
    }
}
