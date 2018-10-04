#!/usr/bin/env bash
find . -type f -name RUNNING_PID -exec rm -f {} \;
mount -t nfs4 -o proto=tcp,port=2049 ${NFS_IP}:/ /root/server/nfs/

if [ "$?" != 0 ]; then
    echo "ERROR: NFS share failed to mount: $?"
    exit -1;
else
    echo "NFS share mount successfully"
fi

/root/server/bin/./contest-server -Dplay.evolutions.db.default.autoApply=true