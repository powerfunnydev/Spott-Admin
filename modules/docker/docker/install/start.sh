#!/bin/sh

# Change to the script directory
CWD=$(pwd)
SCRIPT=$(readlink -f $0)
SCRIPT_DIR=`dirname $SCRIPT`
cd $SCRIPT_DIR

# Start with sample
if [ ! -f docker-compose.yml ]; then
	cp docker-compose-sample.yml docker-compose.yml
fi

# Set local environment
if [ -f setEnv.sh ]; then
    . ./setEnv.sh
fi

docker-compose down
docker-compose pull
docker-compose up -d --force-recreate web

cd $CWD