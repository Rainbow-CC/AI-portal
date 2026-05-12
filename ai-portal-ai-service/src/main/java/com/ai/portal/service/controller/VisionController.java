package com.ai.portal.service.controller;

import com.ai.portal.service.service.ChatService;
import com.ai.portal.common.constant.AuthConstants;
import lombok.Data;
import org.springframework.web.bind.annotation.*;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/chat")
public class VisionController {

    private final ChatService chatService;

    public VisionController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/vision")
    public CompletableFuture<VisionResponse> callVision(
            @RequestHeader(AuthConstants.HEADER_API_KEY) String apiKey,
            @RequestBody VisionRequest request) {
        
        // 聚合层：异步处理，不阻塞 Servlet 线程
        return chatService.callWithBase64Async(request.getImageBase64(), request.getUserMessage())
                .thenApply(content -> {
                    VisionResponse response = new VisionResponse();
                    response.setContent(content);
                    response.setSessionid(request.getSessionid());
                    return response;
                });
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
