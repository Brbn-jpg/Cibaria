FROM amazoncorretto:23-alpine-jdk
LABEL maintainer="K&K Dev team"
COPY target/cibaria-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT [ "java","-jar","app.jar" ]
