package com.ai.portal.service.service;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.alibaba.dashscope.aigc.multimodalconversation.MultiModalConversation;
import com.alibaba.dashscope.aigc.multimodalconversation.MultiModalConversationParam;
import com.alibaba.dashscope.aigc.multimodalconversation.MultiModalConversationResult;
import com.alibaba.dashscope.common.MultiModalMessage;
import com.alibaba.dashscope.common.Role;
import com.alibaba.dashscope.utils.Constants;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ChatService {

    static {
        Constants.baseHttpApiUrl = "https://dashscope.aliyuncs.com/api/v1";
    }

    private static final String MODELCODE = "qwen-vl-plus";

    @Value("${dashscope.api-key}")
    private String apiKey;

    /**
     * 异步调用多模态大模型
     * 模拟对集团接口的封装与加工
     */
    @Async
    public CompletableFuture<String> callWithBase64Async(String base64Image, String userMessage) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // 1. 请求预处理（加工层职责）
                String formattedBase64 = base64Image;
                if (!base64Image.startsWith("data:")) {
                    formattedBase64 = "data:image/png;base64," + base64Image;
                }

                // 2. 封装集团标准参数
                MultiModalConversation conv = new MultiModalConversation();
                MultiModalMessage message = MultiModalMessage.builder()
                        .role(Role.USER.getValue())
                        .content(Arrays.asList(
                                Collections.singletonMap("image", formattedBase64),
                                Collections.singletonMap("text", userMessage)
                        )).build();

                MultiModalConversationParam param = MultiModalConversationParam.builder()
                        .apiKey(apiKey)
                        .model(MODELCODE)
                        .messages(Collections.singletonList(message))
                        .build();

                log.info("Aggregator: Processing request and calling AI model: {}", MODELCODE);
                
                // 3. 执行调用
                MultiModalConversationResult result = conv.call(param);
                
                // 4. 响应后处理
                if (result.getOutput() != null && 
                    result.getOutput().getChoices() != null && 
                    !result.getOutput().getChoices().isEmpty()) {
                    
                    Map<String, Object> content = result.getOutput().getChoices().get(0).getMessage().getContent().get(0);
                    return (String) content.get("text");
                }
                return "No response from model";
            } catch (Exception e) {
                log.error("AI service error: ", e);
                return "Error: " + e.getMessage();
            }
        });
    }
}
