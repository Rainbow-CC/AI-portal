package com.ai.portal.gateway.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicReference;

@Component
@Slf4j
public class SimpleAddressManager {

    private final AtomicReference<Map<String, String>> serviceAddresses = new AtomicReference<>(new ConcurrentHashMap<>());

    @Scheduled(fixedDelay = 30000)
    public void fetchAddressesFromBank() {
        try {
            log.info("开始从银行 SDK 同步服务地址...");
            
            // 从银行 SDK 获取多个服务的最新地址
            Map<String, String> newAddresses = getAddressFromCiit();

            // 整体替换 Map
            if (!newAddresses.isEmpty()) {
                serviceAddresses.set(newAddresses);
                log.info("服务地址同步成功，共同步 {} 个服务", newAddresses.size());
            }
        } catch (Exception e) {
            log.error("定时获取多服务地址失败: {}", e.getMessage());
        }
    }

    // todo: mock data for ciit
    private Map<String, String> getAddressFromCiit() {
        Map<String, String> map = new ConcurrentHashMap<>();
        map.put("chat-service", "https://api.bank.com/v1/chat");
        map.put("auth-service", "https://api.bank.com/v1/auth");
        map.put("payment-service", "https://api.bank.com/v1/payment");
        return map;
    }

    /**
     * 根据服务名称获取当前有效的地址
     * @param serviceName 服务名称
     * @return 地址字符串，如果不存在则返回 null
     */
    public String getAddress(String serviceName) {
        return serviceAddresses.get().get(serviceName);
    }

    /**
     * 获取所有服务的地址映射
     */
    public Map<String, String> getAllAddresses() {
        return serviceAddresses.get();
    }
}