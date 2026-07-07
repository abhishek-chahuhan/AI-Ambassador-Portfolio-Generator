# Stage 1: Build the Backend and embed the static frontend
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .

# Copy your frontend static assets directly into Spring Boot's static folder
COPY frontend/ /app/backend/src/main/resources/static/

# Step inside backend and compile everything into a single JAR
RUN cd backend && mvn clean package -DskipTests

# Stage 2: Run the unified application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]