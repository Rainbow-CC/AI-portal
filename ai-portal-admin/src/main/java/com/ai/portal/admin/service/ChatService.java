package com.ai.portal.admin.service;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.alibaba.dashscope.aigc.multimodalconversation.MultiModalConversation;
import com.alibaba.dashscope.aigc.multimodalconversation.MultiModalConversationParam;
import com.alibaba.dashscope.aigc.multimodalconversation.MultiModalConversationResult;
import com.alibaba.dashscope.common.MultiModalMessage;
import com.alibaba.dashscope.common.Role;
import com.alibaba.dashscope.exception.ApiException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import com.alibaba.dashscope.exception.UploadFileException;
import com.alibaba.dashscope.utils.Constants;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ChatService {

    static {
        Constants.baseHttpApiUrl = "https://dashscope.aliyuncs.com/api/v1";
    }

    private static final String MODELCODE = "qwen3.5-flash";

    @Value("${dashscope.api-key}")
    private String apiKey;

    /**
     * 使用 Base64 图片调用多模态大模型
     *
     * @param base64Image 图片的 Base64 编码（不带前缀或带 data:image/...;base64, 前缀）
     * @param userMessage 用户消息
     * @return 模型的文本回复
     */
    public String callWithBase64(String base64Image, String userMessage) throws NoApiKeyException, ApiException, UploadFileException {
        String formattedBase64 = base64Image;
        if (!base64Image.startsWith("data:")) {
            formattedBase64 = "data:image/png;base64," + base64Image;
        }

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

        log.debug("Calling DashScope MultiModalConversation with model: {}", MODELCODE);
        MultiModalConversationResult result = conv.call(param);
        
        if (result.getOutput() != null && 
            result.getOutput().getChoices() != null && 
            !result.getOutput().getChoices().isEmpty()) {
            
            Map<String, Object> content = result.getOutput().getChoices().get(0).getMessage().getContent().get(0);
            return (String) content.get("text");
        }
        
        return "No response from model";
    }
}
