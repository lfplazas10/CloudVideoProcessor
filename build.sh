#!/usr/bin/env bash
# Remember to export all necessary env vars before running this script
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_171.jdk/Contents/Home
export APP_SECRET=ffd91725f5c741ddb778634dae3a0712e
if [ "$1" == "true" ]; then
    rm -r public/*
    npm run build --prefix web/
    mv web/build/* public/
fi
if [ "$2" == "true" ]; then
    rm -r target/universal/contest-server-1.zip
    rm -r Dockerfiles/contest-server-1*
    sbt dist
    mv target/universal/contest-server-1.zip Dockerfiles/
    docker build Dockerfiles/. -t development2018/contest-server-d
fi
if [ "$3" == "true" ]; then
    docker push development2018/contest-server-d
fi