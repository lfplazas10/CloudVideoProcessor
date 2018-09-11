FROM openjdk:10.0.2-13-jdk-slim-sid
WORKDIR /root
COPY target/universal/play-java-starter-example-1.0-SNAPSHOT.zip /root/
RUN unzip play-java-starter-example-1.0-SNAPSHOT.zip && mv play-java-starter-example-1.0-SNAPSHOT server
RUN rm -r play-java-starter-example-1.0-SNAPSHOT.zip
WORKDIR /root/server/bin/
