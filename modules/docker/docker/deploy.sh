#!/bin/sh
# 
# Deploys the application to a requested host
#
SCRIPT=`basename "$0"`

# We need the host
HOST=$1
if [ -z "$HOST" ]; then
	echo "ERROR: usage $SCRIPT <hostname>"
	exit 1
fi

# Configure the deployment environment
ENV_FILE=~/.appiness/setupDeploymentEnvironment.sh
if [ ! -f $ENV_FILE ]; then
	echo "ERROR: $ENV_FILE does not exist. See https://appiness.atlassian.net/wiki/display/DEV/Docker#Docker-Deployment"
	exit 1
fi
. $ENV_FILE

# We need the key file
if [ -z "$DEPLOY_SSH_KEY_FILE" ]; then
	echo "Error: No DEPLOY_SSH_KEY_FILE environment variable set. Please check the contents of $ENV_FILE"
	exit 1
fi

# constants
USER_NAME=sysadmin
LOGIN_HOST=$USER_NAME@$HOST
VERSION=`cat ./version`

echo "*** Copying installation files for version $VERSION to $HOST using key file $DEPLOY_SSH_KEY_FILE"
scp -i $DEPLOY_SSH_KEY_FILE -r install $LOGIN_HOST:/home/sysadmin
ssh -i $DEPLOY_SSH_KEY_FILE $LOGIN_HOST 'chmod +x -R /home/sysadmin/install/*.sh'

echo "*** Starting application version $VERSION"
ssh -i $DEPLOY_SSH_KEY_FILE $LOGIN_HOST '/home/sysadmin/install/start.sh'

echo "*** Done"


