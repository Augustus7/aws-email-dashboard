#!/bin/bash

export START_MOD=engine
export CONF_FILE=conf.json

cd /opt/vertx/current/bin

nohup ./vertx runmod $START_MOD -conf $CONF_FILE