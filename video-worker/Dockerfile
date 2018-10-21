FROM alpine:latest
WORKDIR /root
RUN apk add nodejs && apk add ffmpeg && apk add npm && apk add bash && apk add nfs-utils && mkdir videos
COPY package.json /root
COPY entry-point.sh /root
RUN npm install -y && chmod +x entry-point.sh
COPY index.js /root
COPY queue.js /root
RUN chmod 755 index.js entry-point.sh
