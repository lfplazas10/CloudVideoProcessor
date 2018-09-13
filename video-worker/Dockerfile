FROM alpine:latest
WORKDIR /root
RUN apk add nodejs && apk add ffmpeg && apk add npm && apk add bash && apk add nfs-utils && mkdir nfs
COPY index.js /root
COPY package.json /root
COPY entry-point.sh /root
RUN npm install -y && chmod +x entry-point.sh
