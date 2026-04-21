package com.ai.portal.gateway;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LongSummaryStatistics;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class PerformanceTest {

    private static final String BASE_URL = "http://localhost:8080/v1/ai";
    private static final int TOTAL_REQUESTS = 300;
    private static final int CONCURRENCY = 20;    
    private static final String API_KEY = "perf-test-key";

    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();

        System.out.println("========== 网关性能全场景测试 ==========");
        
        // 场景 1: Fast 接口 (测试极限 TPS)
        runTest(client, "FAST 场景", BASE_URL + "/fast");

        System.out.println("\n等待 2 秒进行下一项测试...\n");
        Thread.sleep(2000);

        // 场景 2: Slow 接口 (测试长连接处理能力，模拟 500ms 延迟)
        runTest(client, "SLOW 场景 (3000ms 延迟)", BASE_URL + "/slow?ms=3000");
        
        System.out.println("========================================");
    }

    private static void runTest(HttpClient client, String scenarioName, String url) {
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failCount = new AtomicInteger(0);
        AtomicInteger rateLimitedCount = new AtomicInteger(0);
        CopyOnWriteArrayList<Long> serviceLatencies = new CopyOnWriteArrayList<>();
        Semaphore semaphore = new Semaphore(CONCURRENCY);

        System.out.printf(">>> 开始测试 [%s] <<<\n目标: %s\n", scenarioName, url);
        long startTime = System.currentTimeMillis();

        var futures = IntStream.range(0, TOTAL_REQUESTS)
                .mapToObj(i -> {
                    try {
                        semaphore.acquire();
                        long reqStart = System.currentTimeMillis();
                        
                        HttpRequest request = HttpRequest.newBuilder()
                                .uri(URI.create(url))
                                .header("X-API-Key", API_KEY)
                                .timeout(Duration.ofSeconds(20))
                                .GET()
                                .build();

                        return client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                                .thenAccept(res -> {
                                    long reqEnd = System.currentTimeMillis();
                                    serviceLatencies.add(reqEnd - reqStart);
                                    
                                    if (res.statusCode() == 200) {
                                        successCount.incrementAndGet();
                                    } else if (res.statusCode() == 429) {
                                        rateLimitedCount.incrementAndGet();
                                    } else {
                                        failCount.incrementAndGet();
                                    }
                                })
                                .exceptionally(ex -> {
                                    failCount.incrementAndGet();
                                    return null;
                                })
                                .whenComplete((r, ex) -> semaphore.release());
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        return CompletableFuture.completedFuture(null);
                    }
                })
                .collect(Collectors.toList());

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        long duration = System.currentTimeMillis() - startTime;
        LongSummaryStatistics stats = serviceLatencies.stream().mapToLong(Long::longValue).summaryStatistics();

        System.out.printf("\n--- [%s] 报告 ---\n", scenarioName);
        System.out.printf("成功: %d | 限流: %d | 失败: %d\n", successCount.get(), rateLimitedCount.get(), failCount.get());
        System.out.printf("平均 TPS: %.2f\n", (double) TOTAL_REQUESTS / (duration / 1000.0));
        System.out.printf("延迟 Avg: %.2f ms (Min: %d, Max: %d)\n", stats.getAverage(), stats.getMin(), stats.getMax());
        System.out.println("----------------------------------");
    }
}
