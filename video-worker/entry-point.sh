#!/usr/bin/env bash
mount -t nfs4 -o proto=tcp,port=2049 ${NFS_IP}:/ /root/nfs
crond -l 8 && tail -f /var/log/cron.log