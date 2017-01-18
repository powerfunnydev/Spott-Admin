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

# We need the configuration directory
if [ ! -f "$SCRIPT_DIR/config/Dockerfile" ]; then
    echo "Error: $SCRIPT_DIR/config/Dockerfile does not exist. Unable to create the configuration container"
    exit 1
fi

# Create the configuration container
docker build -t docker.appiness.mobi/apptvate-$DEPLOY_ENV-web-config $SCRIPT_DIR/config
docker push docker.appiness.mobi/apptvate-$DEPLOY_ENV-web-config

# Restart
docker-compose down -v
docker-compose pull
docker-compose up -d --force-recreate

cd $CWD