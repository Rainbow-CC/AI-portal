# ==========================================
# Phase 1: Builder (Maven + JDK 17)
# ==========================================
FROM maven:3.9-eclipse-temurin-17 AS builder

# Set the working directory inside the container
WORKDIR /build

# Copy the entire project source code to the container
COPY . .

# Execute Maven build with BuildKit cache mount for local repository
# -pl ai-portal-admin: Build only the admin module
# -am (also make): Build all projects required by the specified projects
# -DskipTests: Skip unit tests for faster build
RUN --mount=type=cache,target=/root/.m2 \
    mvn clean package -pl ai-portal-admin -am -DskipTests

# ==========================================
# Phase 2: Runner (JRE 17 Alpine)
# ==========================================
FROM eclipse-temurin:17-jre-alpine

# Set the working directory
WORKDIR /app

# Copy only the final artifact from the builder stage
COPY --from=builder /build/ai-portal-admin/target/ai-portal-admin-*.jar app.jar

# Application listens on port 8081 by default
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
