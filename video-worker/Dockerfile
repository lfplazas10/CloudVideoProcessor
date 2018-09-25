FROM alpine:latest
WORKDIR /root
RUN apk add nodejs && apk add ffmpeg && apk add npm && apk add bash && apk add nfs-utils && mkdir nfs
#COPY crontab /etc/crontabs
COPY package.json /root
COPY entry-point.sh /root
RUN npm install -y && chmod +x entry-point.sh
COPY index.js /root
RUN chmod 755 index.js entry-point.sh
#RUN chmod 0644 /etc/crontabs/crontab && crontab /etc/crontabs/crontab && touch /var/log/cron.log
