#!/bin/sh

VERSION=latest
if [ -n "$1" ]; then
	VERSION=$1
fi

LOCAL_PORT=8080
if [ -n "$2" ]; then
	LOCAL_PORT=$2
fi

CMD="docker run --rm --name apptvate.website -p $LOCAL_PORT:80 docker.appiness.mobi/apptvate.website:$VERSION"
echo $CMD
$CMD
