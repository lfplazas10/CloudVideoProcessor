FROM openjdk:10.0.2-13-jdk-slim-sid
COPY target/universal/play-java-starter-example-1.0-SNAPSHOT.zip /root/
RUN ls
WORKDIR /root
RUN apt-get install unzip
RUN unzip play-java-starter-example-1.0-SNAPSHOT.zip
WORKDIR /root/play-java-starter-example-1.0-SNAPSHOT/bin
RUN ls
