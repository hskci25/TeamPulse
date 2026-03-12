# Build stage
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B -q

COPY src ./src
RUN mvn package -DskipTests -B -q && \
    cp target/teampulse-backend-*.jar target/app.jar

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Non-root user
RUN adduser -D appuser
USER appuser

COPY --from=build /app/target/app.jar ./app.jar

# Render sets PORT; Spring Boot reads server.port from PORT
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
