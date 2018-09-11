FROM openjdk:8u171-jdk-alpine3.8

ENV FFMPEG_VERSION=3.2.12

WORKDIR /root

RUN apk update
RUN apk add ffmpeg
RUN apk add bash

COPY play-java-starter-example-1.0-SNAPSHOT.zip /root/
RUN unzip play-java-starter-example-1.0-SNAPSHOT.zip && mv play-java-starter-example-1.0-SNAPSHOT server
RUN rm -r play-java-starter-example-1.0-SNAPSHOT.zip
