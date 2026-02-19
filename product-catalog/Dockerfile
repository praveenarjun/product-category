# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Run
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Ensure the app directory is owned by our user
RUN chown appuser:appgroup /app

# Switch user AFTER creating group/user but BEFORE copying files
USER appuser

# CRITICAL: Use --chown so the appuser can actually run the jar
COPY --from=builder --chown=appuser:appgroup /app/target/*.jar app.jar

EXPOSE 8080

# Profile management
ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-jar", "app.jar"]
