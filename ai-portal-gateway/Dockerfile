# ==========================================
# Phase 1: Builder (Maven + JDK 17)
# ==========================================
FROM maven:3.9-eclipse-temurin-17 AS builder

# Set the working directory inside the container
WORKDIR /build

# Copy the entire project source code to the container
# This is necessary because the gateway module depends on the parent pom and the common module
COPY . .

# Execute Maven build with BuildKit cache mount for local repository
# -pl ai-portal-gateway: Build only the gateway module
# -am (also make): Build all projects required by the specified projects
# -Dmaven.test.skip=true: Skip test compilation and execution for faster, more robust builds
RUN --mount=type=cache,target=/root/.m2 \
    mvn clean package -pl ai-portal-gateway -am -Dmaven.test.skip=true

# ==========================================
# Phase 2: Runner (JRE 17 Alpine)
# ==========================================
FROM eclipse-temurin:17-jre-alpine

# Set the working directory
WORKDIR /app

# Copy only the final artifact from the builder stage
# We use a explicit name to avoid issues with version numbers or multiple artifacts
COPY --from=builder /build/ai-portal-gateway/target/ai-portal-gateway.jar app.jar

# Application listens on port 8080 by default
EXPOSE 8080

# Run the application
# Use shell form or exec form: ["java", "-jar", "app.jar"]
ENTRYPOINT ["java", "-jar", "app.jar"]
