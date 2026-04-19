package com.ai.portal.gateway.service;

import java.util.Arrays;
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
import com.alibaba.dashscope.utils.Constants;

/**
 * 原 ChatService 的手动测试类，包含多种调用示例
 */
public class ChatServiceManualTest {

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
                .apiKey(System.getenv("DASHSCOPE_API_KEY"))
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
                .apiKey(System.getenv("DASHSCOPE_API_KEY"))
                .model("qwen-vl-plus")
                .message(userMessage)
                .build();
        MultiModalConversationResult result = conv.call(param);
        System.out.println(JsonUtils.toJson(result));
    }

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

    public static void callWithLocalFile(String localPath) throws ApiException, NoApiKeyException, UploadFileException, IOException {
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
                .apiKey(System.getenv("DASHSCOPE_API_KEY"))
                .model("qwen3.6-plus")
                .messages(Arrays.asList(userMessage))
                .build();

        MultiModalConversationResult result = conv.call(param);
        System.out.println(result.getOutput().getChoices().get(0).getMessage().getContent().get(0).get("text"));
    }

    public static void main(String[] args) {
        // try {
        //     // 注意：请确保本地存在该图片或修改为正确的路径
        //     // callWithLocalFile("C:\\Users\\49473\\OneDrive\\图片\\证件\\mmexport1687843029073.jpg");
        //     System.out.println("请在代码中指定图片路径并取消注释以进行本地测试。");
        // } catch (Exception e) {
        //     System.out.println(e.getMessage());
        // }
        // System.exit(0);

        String localPath = "C:\\Users\\49473\\OneDrive\\图片\\证件\\mmexport1693707928238.jpg";
        byte[] imageBytes = null;
        try {
            imageBytes = compressImage(localPath, 5 * 1024 * 1024);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);
        try {
            Path outputPath = Paths.get("data/img/testb64.txt");
            Files.createDirectories(outputPath.getParent());
            Files.write(outputPath, base64Image.getBytes());
            System.out.println("Base64 数据已生成在: " + outputPath.toAbsolutePath());
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
