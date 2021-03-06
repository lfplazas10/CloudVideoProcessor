#!/usr/bin/env bash
if [ "$1" == "m1" ]; then
    ssh -i /Users/felipeplazas/Downloads/keys.pem ubuntu@18.223.12.197
elif [ "$1" == "server" ]; then
    ssh -i /Users/felipeplazas/Downloads/keys.pem ubuntu@18.224.26.66
elif [ "$1" == "worker" ]; then
    ssh -i /Users/felipeplazas/Downloads/keys.pem ubuntu@52.14.198.217
elif [ "$1" == "nfs" ]; then
    ssh -i /Users/felipeplazas/Downloads/keys.pem ubuntu@18.223.240.69
else
    echo "ssh -i /Users/felipeplazas/Downloads/Cloud/3s.pem ubuntu@$1"
    ssh -oStrictHostKeyChecking=no -i /Users/felipeplazas/Downloads/Cloud/thirdSubmission.pem "ubuntu@$1"
    if [ "$?" != 0 ]; then
        echo "You must select one from [m1, server, worker, nfs], For example:"
        echo "./ssh.sh server"
    fi
fi
