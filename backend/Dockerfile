# =================================================================
# STAGE 1: Building the application (Builder)
# We use Maven based on Eclipse Temurin 21.
# =================================================================
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml first to leverage Docker's layer caching
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Build the application, skipping tests
RUN mvn package -DskipTests


# =================================================================
# STAGE 2: Runtime Environment (Runtime)
# We use a minimal Eclipse Temurin JRE (Java Runtime Environment) image.
# =================================================================
FROM eclipse-temurin:21-jre-alpine

# Set the working directory
WORKDIR /app

# Create a dedicated user and group for the application for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only the compiled .jar file from the "builder" stage
# and set its ownership to our new user at the same time
COPY --from=builder --chown=appuser:appgroup /app/target/*.jar app.jar

# Set the user who will run the application (avoid running as root)
USER appuser

# Inform Docker that the container listens on port 8080
EXPOSE 8080

# Command to run the application
ENTRYPOINT [ "java", "-jar", "app.jar" ]
