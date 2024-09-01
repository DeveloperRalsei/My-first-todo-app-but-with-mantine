#!/bin/bash

if [ "$1" == "dev" ]; then
    npm run dev & cd server/ && npm run dev
else
    cd server/ && npm run start &
    npm run start
fi
