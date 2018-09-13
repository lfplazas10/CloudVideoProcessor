#!/usr/bin/env bash
# Remember to export all necessary env vars before running this script
if [ "$1" == "true" ]; then
    docker build . -t lfplazas10/video-worker
fi
if [ "$2" == "true" ]; then
    docker push lfplazas10/video-worker
fi