#!/usr/bin/env bash
# Remember to export all necessary env vars before running this script
sbt dist
npm run build --prefix web/
rm -r public/*
mv web/build/* public/
docker build .
