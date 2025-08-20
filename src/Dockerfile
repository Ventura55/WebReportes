# Etapa de build con JDK 21
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# (opcional) imprime versiones para verificar
RUN java -version && mvn -v

COPY pom.xml .
COPY .mvn ./.mvn
COPY mvnw ./
RUN sed -i 's/\r$//' mvnw || true && chmod +x mvnw
RUN ./mvnw -B -DskipTests dependency:go-offline

COPY src ./src
RUN ./mvnw -B -DskipTests package

# Runtime con JRE 21
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75"
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]
