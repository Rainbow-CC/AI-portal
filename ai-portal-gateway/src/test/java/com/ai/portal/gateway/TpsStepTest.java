package com.ai.portal.gateway;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 改进版梯度压力测试：基于持续时间的观测（消除突发容量的干扰）
 */
public class TpsStepTest {

    private static final String TARGET_URL = "http://localhost:8080/v1/ai/fast";
    private static final String API_KEY = "step-test-key-v2";
    private static final int[] CONCURRENCY_STEPS = {10, 50, 100, 150, 200, 300, 500};
    private static final int DURATION_PER_STEP_MS = 3000; // 每个梯度持续 3 秒

    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();

        List<TestResult> results = new ArrayList<>();

        System.out.println(">>> 改进版梯度压测 (持续时间驱动) <<<");
        System.out.println("限流配置: Rate=150/s, Burst=200\n");

        for (int concurrency : CONCURRENCY_STEPS) {
            System.out.printf("正在测试并发数: %d ... ", concurrency);
            TestResult res = runStep(client, concurrency);
            results.add(res);
            System.out.printf("完成. Sustained Success TPS: %.2f\n", res.successTps);
            //确保 Redis 令牌桶填满
            Thread.sleep(2000);
        }

        System.out.println("\n==================== 持续性 TPS 报告 ====================");
        System.out.println("并发数\t总请求\t成功数\t限流数\t有效TPS (Sustained)\t总吞吐TPS");
        System.out.println("----------------------------------------------------------");
        for (TestResult r : results) {
            System.out.printf("%d\t%d\t%d\t%d\t%.2f\t\t\t%.2f\n", 
                r.concurrency, r.totalRequests, r.successCount, r.rateLimitedCount, r.successTps, r.totalTps);
        }
        System.out.println("==========================================================");
    }

    private static TestResult runStep(HttpClient client, int concurrency) {
        AtomicInteger success = new AtomicInteger(0);
        AtomicInteger rateLimited = new AtomicInteger(0);
        AtomicInteger total = new AtomicInteger(0);
        AtomicBoolean running = new AtomicBoolean(true);
        Semaphore semaphore = new Semaphore(concurrency);
        
        long startTime = System.currentTimeMillis();
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        // 在指定时间内不断提交任务
        while (System.currentTimeMillis() - startTime < DURATION_PER_STEP_MS) {
            try {
                if (semaphore.tryAcquire()) {
                    total.incrementAndGet();
                    HttpRequest request = HttpRequest.newBuilder()
                            .uri(URI.create(TARGET_URL))
                            .header("X-API-Key", API_KEY)
                            .GET()
                            .build();

                    CompletableFuture<Void> f = client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                            .thenAccept(res -> {
                                if (res.statusCode() == 200) success.incrementAndGet();
                                else if (res.statusCode() == 429) rateLimited.incrementAndGet();
                            })
                            .whenComplete((r, ex) -> semaphore.release());
                    futures.add(f);
                } else {
                    // 如果并发满了，稍微歇一下，避免死循环空转
                    Thread.sleep(1);
                }
            } catch (Exception e) {
                break;
            }
        }

        // 等待最后提交的一批任务完成
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        long actualDuration = System.currentTimeMillis() - startTime;

        double successTps = (double) success.get() / (actualDuration / 1000.0);
        double totalTps = (double) total.get() / (actualDuration / 1000.0);

        return new TestResult(concurrency, total.get(), success.get(), rateLimited.get(), successTps, totalTps);
    }

    static class TestResult {
        int concurrency;
        int totalRequests;
        int successCount;
        int rateLimitedCount;
        double successTps;
        double totalTps;

        public TestResult(int concurrency, int totalRequests, int successCount, int rateLimitedCount, double successTps, double totalTps) {
            this.concurrency = concurrency;
            this.totalRequests = totalRequests;
            this.successCount = successCount;
            this.rateLimitedCount = rateLimitedCount;
            this.successTps = successTps;
            this.totalTps = totalTps;
        }
    }
}
