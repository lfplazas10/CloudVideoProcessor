FROM openjdk:8u171-jdk-alpine3.8

ENV FFMPEG_VERSION=3.2.12

WORKDIR /root

RUN apk update && apk add ffmpeg && apk add bash && apk add nfs-utils
COPY play-java-starter-example-1.0-SNAPSHOT.zip /root/
RUN unzip play-java-starter-example-1.0-SNAPSHOT.zip && ls && mv play-java-starter-example-1.0-SNAPSHOT server && rm -r play-java-starter-example-1.0-SNAPSHOT.zip && cd server && mkdir nfs
COPY entry-point.sh /root/server/
RUN chmod +x /root/server/entry-point.sh
