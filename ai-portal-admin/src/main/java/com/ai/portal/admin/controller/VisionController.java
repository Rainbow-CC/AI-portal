package com.ai.portal.admin.controller;

import com.ai.portal.admin.service.ChatService;
import com.ai.portal.common.constant.AuthConstants;
import lombok.Data;
import org.springframework.web.bind.annotation.*;
import com.alibaba.dashscope.exception.ApiException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import com.alibaba.dashscope.exception.UploadFileException;

@RestController
@RequestMapping("/chat")
public class VisionController {

    private final ChatService chatService;

    public VisionController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/vision")
    public VisionResponse callVision(
            @RequestHeader(AuthConstants.HEADER_API_KEY) String apiKey,
            @RequestBody VisionRequest request) throws NoApiKeyException, ApiException, UploadFileException {
        
        // sessionid 目前在后端暂未深度使用，这里可以记录日志或传递给服务
        String content = chatService.callWithBase64(request.getImageBase64(), request.getUserMessage());
        
        VisionResponse response = new VisionResponse();
        response.setContent(content);
        response.setSessionid(request.getSessionid());
        return response;
    }

    @Data
    public static class VisionRequest {
        private String imageBase64;
        private String sessionid;
        private String userMessage;
    }

    @Data
    public static class VisionResponse {
        private String content;
        private String sessionid;
    }
}
