#!/bin/bash
cd "$(dirname "$(realpath "$0")")" || exit; # Change to the directory that contains this script
./build-docker-images.sh
cd "$(dirname "$(realpath "$0")")" || exit; # Change to the directory that contains this script
docker-compose up
