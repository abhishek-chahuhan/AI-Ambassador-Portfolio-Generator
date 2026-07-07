# Stage 1: Build the Frontend
FROM node:18-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Backend with the compiled Frontend assets
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY . .
# Copy the built frontend static files directly into Spring Boot's public assets folder
COPY --from=frontend-build /frontend/dist /app/backend/src/main/resources/static/
RUN cd backend && mvn clean package -DskipTests

# Stage 3: Run the integrated application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]