#!/bin/bash
cd "$(dirname "$(realpath "$0")")" || exit; # Change to the directory that contains this script
cd frontend || exit
./build.sh
cd ../yoga-server || exit
./build.sh
