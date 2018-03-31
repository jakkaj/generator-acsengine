#!/usr/bin/env bash

loc=$PWD

if [[ $loc = *"/bash"* ]]; then
  cd ..
fi

acs-engine generate buildacs.json