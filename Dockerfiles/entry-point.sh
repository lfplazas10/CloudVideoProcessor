#!/usr/bin/env bash
mount -t nfs4 -o proto=tcp,port=2049 ${NFS_IP}:/ /root/server/nfs/
/root/server/bin/./contest-server -Dplay.evolutions.db.default.autoApply=true