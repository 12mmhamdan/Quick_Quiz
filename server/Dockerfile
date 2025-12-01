# ---------- Stage 1: Build the Spring Boot fat JAR ----------
FROM maven:3.9.6-eclipse-temurin-11 AS builder

WORKDIR /app

# Copy pom and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build and REPACKAGE as a Spring Boot executable JAR
RUN mvn -DskipTests package spring-boot:repackage

# ---------- Stage 2: Minimal runtime image ----------
FROM eclipse-temurin:11-jre

WORKDIR /app

# Copy the fat JAR created by Spring Boot
COPY --from=builder /app/target/quick-quiz-1.0-SNAPSHOT.jar app.jar

# Cloud Run will set PORT, default 8080
ENV PORT=8080
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
