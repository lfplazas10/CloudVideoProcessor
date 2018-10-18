FROM openjdk:8u171-jdk-alpine3.8

ENV FFMPEG_VERSION=3.2.12

WORKDIR /root

RUN apk update && apk add ffmpeg && apk add bash && apk add nfs-utils
COPY server /root/server
COPY entry-point.sh /root/server/
RUN cd server && chmod +x /root/server/entry-point.sh
