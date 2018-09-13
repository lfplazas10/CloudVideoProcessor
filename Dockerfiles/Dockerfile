FROM openjdk:8u171-jdk-alpine3.8

ENV FFMPEG_VERSION=3.2.12

WORKDIR /root

RUN apk update && apk add ffmpeg && apk add bash && apk add nfs-utils
COPY contest-server-1.zip /root/
RUN unzip contest-server-1.zip && ls && mv contest-server-1 server && rm -r contest-server-1.zip && cd server && mkdir nfs
COPY entry-point.sh /root/server/
RUN chmod +x /root/server/entry-point.sh
