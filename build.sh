#!/usr/bin/env bash
# Remember to export all necessary env vars before running this script
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_171.jdk/Contents/Home
rm -r public/*
rm -r Dockerfiles/play-java*
rm -r target/universal/play-java-starter-example-1.0-SNAPSHOT.zip
npm run build --prefix web/
mv web/build/* public/
sbt dist
mv target/universal/play-java-starter-example-1.0-SNAPSHOT.zip Dockerfiles/
docker build Dockerfiles/. -t lfplazas10/contest-server
docker push lfplazas10/contest-server
