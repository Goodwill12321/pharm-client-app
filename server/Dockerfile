# Start from an official OpenJDK image
FROM openjdk:17-jdk-slim

ENV APP_HOME=/app
WORKDIR $APP_HOME

# Install Maven and curl for healthcheck
RUN apt-get update \
    && apt-get install -y maven curl \
    && rm -rf /var/lib/apt/lists/*

# Create directories for logs, certificates, and chat images
RUN mkdir -p /data/logs /data/certs /data/chat_images

# Expose port
EXPOSE 8080

# Default log, certs, and chat images location as environment variables
ENV LOG_DIR=/data/logs
ENV CERTS_DIR=/data/certs
ENV CHAT_IMAGES_DIR=/data/chat_images

# By default, expect sources to be mounted via volume for hot reload

# Expose debug port
EXPOSE 5005

CMD sh -c 'if [ "$DEV" = "true" ]; then echo "Starting in DEV mode with hot reload..."; mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 -Dspring.devtools.restart.enabled=true"; else echo "Starting in PROD mode..."; mvn spring-boot:run; fi'
