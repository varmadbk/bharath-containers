FROM oraclelinux:8.4  AS mavenBuilder
LABEL name=ashutoshh
RUN yum install java-11-openjdk java-11-openjdk-devel maven -y && mkdir /spring-webapp
COPY java-springboot /spring-webapp/
WORKDIR /spring-webapp
RUN mvn install

FROM tomcat
Label email='ashutoshh@linux.com'
COPY --from=mavenBuilder /spring-webapp/target/*.war /usr/local/tomact/webapps
EXPOSE 8080