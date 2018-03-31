#!/usr/bin/env bash
acctList=$(az account list)

if ! [[ $acctList = *"tenantId"* ]]; then
    az login
else
    echo "You're already logged in"
fi

az account set --subscription "<%= subscription %>"

group="<%= resourceGroup %>"

az group create --name $group --location <%= azureRegion %>
