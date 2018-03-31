#!/usr/bin/env bash

loc=$PWD

if [[ $loc = *"/bash"* ]]; then
  cd ..
fi

az account set --subscription "<%= subscription %>"

az group deployment create \
    --name "<%= dnsPrefix %>acsdeployment" \
    --resource-group "<%= resourceGroup %>" \
    --template-file "./_output/<%= dnsPrefix %>/azuredeploy.json" \
    --parameters "./_output/<%= dnsPrefix %>/azuredeploy.parameters.json"