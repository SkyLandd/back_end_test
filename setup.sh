#!/bin/sh
echo "Creating test .env file ..."
tee -a .env << END
SERVICE_NAME="Game Service"

API_PORT=3081
API_PREFIX=api

API_SWAGGER_DOC="game-service-doc"
API_SWAGGER_TITLE='Game Service'
API_SWAGGER_DESCRIPTION='Game Service'
API_SWAGGER_VERSION='1.0'

TYPEORM_SCHEMA=game_schema
TYPEORM_USERNAME=postgres
TYPEORM_PASSWORD=postgres
TYPEORM_DATABASE=game_database
TYPEORM_TEST_DATABASE=game_database_test
TYPEORM_SYNCHRONIZE=false
TYPEORM_LOGGING=true
TYPEORM_AUTOLOAD=true
END