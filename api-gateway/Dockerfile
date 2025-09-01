
# Base image
FROM eclipse-temurin:21-jdk-alpine

# Set working directory
WORKDIR /app

# Copy jar file (ataovy azo antoka fa efa namorona jar ny project)
COPY target/api-gateway-0.0.1-SNAPSHOT.jar app.jar

# Expose port (mitovy amin'ny docker-compose)
EXPOSE 9000

# Command to run the app
ENTRYPOINT ["java","-jar","app.jar"]