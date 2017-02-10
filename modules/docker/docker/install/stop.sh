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
if [ ! -f setLocalEnv.sh ]; then
    cp setLocalEnvSample.sh setLocalEnv.sh
    chmod +x setLocalEnv.sh
fi
. ./setLocalEnv.sh

# We need the deployment environment
if [ -z "$DEPLOY_ENV" ]; then
    echo "Error: No DEPLOY_ENV environment variable set. Please check the contents of setLocalEnv.sh"
    exit 1
fi

# Stop
docker-compose down -v

cd $CWD