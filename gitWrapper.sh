#!/usr/bin/bash

MESSAGE=$1

git add .
echo "Git add all complete"

git commit -m "$MESSAGE"

