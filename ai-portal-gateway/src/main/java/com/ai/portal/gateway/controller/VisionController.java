package com.ai.portal.gateway.controller;

import com.ai.portal.gateway.service.ChatService;
import lombok.Data;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/chat")
public class VisionController {

    private final ChatService chatService;

    public VisionController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/vision")
    public Mono<VisionResponse> callVision(
            @RequestHeader("X-API-KEY") String apiKey,
            @RequestBody VisionRequest request) {
        
        // sessionid 目前在后端暂未深度使用，这里可以记录日志或传递给服务
        return chatService.callWithBase64(request.getImageBase64(), request.getUserMessage())
                .map(content -> {
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
