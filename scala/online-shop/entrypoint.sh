#!/bin/sh

set -e

ngrok authtoken "$NGROK_TOKEN"

sbt run &

sleep 5

ngrok http 9000