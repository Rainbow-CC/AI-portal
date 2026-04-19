package com.ai.portal.admin.service;

import java.util.Arrays;
import java.lang.System;
import java.util.Collections;
import java.io.IOException;
import java.util.HashMap;
import java.util.Base64;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriter;
import javax.imageio.ImageWriteParam;
import javax.imageio.IIOImage;
import javax.imageio.stream.ImageOutputStream;
import java.io.ByteArrayOutputStream;
import java.util.Iterator;

import com.alibaba.dashscope.aigc.generation.Generation;
import com.alibaba.dashscope.aigc.generation.GenerationParam;
import com.alibaba.dashscope.aigc.generation.GenerationResult;
import com.alibaba.dashscope.common.Message;
import com.alibaba.dashscope.common.Role;
import com.alibaba.dashscope.exception.ApiException;
import com.alibaba.dashscope.exception.InputRequiredException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import com.alibaba.dashscope.utils.JsonUtils;
import com.alibaba.dashscope.aigc.multimodalconversation.MultiModalConversation;
import com.alibaba.dashscope.aigc.multimodalconversation.MultiModalConversationParam;
import com.alibaba.dashscope.aigc.multimodalconversation.MultiModalConversationResult;
import com.alibaba.dashscope.common.MultiModalMessage;
import com.alibaba.dashscope.exception.UploadFileException;
import com.alibaba.dashscope.aigc.multimodalconversation.*;
import com.alibaba.dashscope.utils.Constants;

public class ChatService {

    public static GenerationResult callWithMessage() throws ApiException, NoApiKeyException, InputRequiredException {
        Generation gen = new Generation();
        Message systemMsg = Message.builder()
                .role(Role.SYSTEM.getValue())
                .content("You are a helpful assistant.")
                .build();
        Message userMsg = Message.builder()
                .role(Role.USER.getValue())
                .content("你是谁？")
                .build();
        GenerationParam param = GenerationParam.builder()
                // 若没有配置环境变量，请用百炼API Key将下行替换为：.apiKey("sk-xxx")
                .apiKey(System.getenv("DASHSCOPE_API_KEY"))
                // 此处以qwen-plus为例，可按需更换模型名称。模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
                .model("qwen-plus")
                .messages(Arrays.asList(systemMsg, userMsg))
                .resultFormat(GenerationParam.ResultFormat.MESSAGE)
                .build();
        return gen.call(param);
    }

    public static void simpleMultiModalConversationCall()
            throws ApiException, NoApiKeyException, UploadFileException {
        MultiModalConversation conv = new MultiModalConversation();
        MultiModalMessage userMessage = MultiModalMessage.builder().role(Role.USER.getValue())
                .content(Arrays.asList(
                        Collections.singletonMap("image", "https://dashscope.oss-cn-beijing.aliyuncs.com/images/dog_and_girl.jpeg"),
                        Collections.singletonMap("image", "https://dashscope.oss-cn-beijing.aliyuncs.com/images/tiger.png"),
                        Collections.singletonMap("image", "https://dashscope.oss-cn-beijing.aliyuncs.com/images/rabbit.png"),
                        Collections.singletonMap("text", "这些是什么?"))).build();
        MultiModalConversationParam param = MultiModalConversationParam.builder()
                // 若没有配置环境变量，请用百炼API Key将下行替换为：.apiKey("sk-xxx")
                .apiKey(System.getenv("DASHSCOPE_API_KEY"))
                // 此处以qwen-vl-plus为例，可按需更换模型名称。模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
                .model("qwen-vl-plus")
                .message(userMessage)
                .build();
        MultiModalConversationResult result = conv.call(param);
        System.out.println(JsonUtils.toJson(result));
    }

    // 各地域配置不同，请根据实际地域修改
    static {
        Constants.baseHttpApiUrl = "https://dashscope.aliyuncs.com/api/v1";
    }

    private static byte[] compressImage(String imagePath, long maxSizeInBytes) throws IOException {
        Path path = Paths.get(imagePath);
        byte[] imageBytes = Files.readAllBytes(path);

        if (imageBytes.length <= maxSizeInBytes) {
            return imageBytes;
        }

        System.out.println("图片大小超过 " + (maxSizeInBytes / 1024 / 1024) + "MB，正在压缩...");

        BufferedImage image = ImageIO.read(path.toFile());
        if (image == null) {
            return imageBytes;
        }

        float quality = 0.8f;
        byte[] compressedBytes = imageBytes;

        while (compressedBytes.length > maxSizeInBytes && quality > 0.1f) {
            try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");
                if (!writers.hasNext()) break;
                ImageWriter writer = writers.next();
                try (ImageOutputStream ios = ImageIO.createImageOutputStream(baos)) {
                    writer.setOutput(ios);
                    ImageWriteParam param = writer.getDefaultWriteParam();
                    if (param.canWriteCompressed()) {
                        param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                        param.setCompressionQuality(quality);
                    }
                    writer.write(null, new IIOImage(image, null, null), param);
                }
                writer.dispose();
                compressedBytes = baos.toByteArray();
            }
            quality -= 0.1f;
        }
        System.out.println("压缩完成，最终大小: " + (compressedBytes.length / 1024) + "KB");
        return compressedBytes;
    }

    /**
     * 多模态大模型，上传本地图片
     * @param localPath
     * @throws ApiException
     * @throws NoApiKeyException
     * @throws UploadFileException
     * @throws IOException
     */
    public static void callWithLocalFile(String localPath) throws ApiException, NoApiKeyException, UploadFileException, IOException {

        // 压缩图片至 5MB 以下
        byte[] imageBytes = compressImage(localPath, 5 * 1024 * 1024);
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);

        MultiModalConversation conv = new MultiModalConversation();
        MultiModalMessage userMessage = MultiModalMessage.builder().role(Role.USER.getValue())
                .content(Arrays.asList(
                        new HashMap<String, Object>() {{
                            put("image", "data:image/png;base64," + base64Image);
                        }},
                        new HashMap<String, Object>() {{
                            put("text", "提取证书编号和证书查询网址");
                        }}
                )).build();

        MultiModalConversationParam param = MultiModalConversationParam.builder()
                // 各地域的API Key不同。获取API Key：https://help.aliyun.com/zh/model-studio/get-api-key
                .apiKey(System.getenv("DASHSCOPE_API_KEY"))
                .model("qwen3.6-plus")
                .messages(Arrays.asList(userMessage))
                .build();

        MultiModalConversationResult result = conv.call(param);
        System.out.println(result.getOutput().getChoices().get(0).getMessage().getContent().get(0).get("text"));
    }

    public static void main(String[] args) {
        // try {
        //     GenerationResult result = callWithMessage();
        //     System.out.println(JsonUtils.toJson(result));
        // } catch (ApiException | NoApiKeyException | InputRequiredException e) {
        //     // 使用日志框架记录异常信息
        //     System.err.println("An error occurred while calling the generation service: " + e.getMessage());
        // }
        // System.exit(0);

        try {
            // 将 xxx/eagle.png 替换为你本地图像的绝对路径
            callWithLocalFile("C:\\Users\\49473\\OneDrive\\图片\\证件\\mmexport1687843029073.jpg");
        } catch (ApiException | NoApiKeyException | UploadFileException | IOException e) {
            System.out.println(e.getMessage());
        }
        System.exit(0);
    }
}
