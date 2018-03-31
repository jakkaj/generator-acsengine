#!/usr/bin/env bash

echo "This script will help you create an Azure service principal"

acctList=$(az account list)

if ! [[ $acctList = *"tenantId"* ]]; then
    az login
else
    echo "You're already logged in"
fi

read -p "Please enter your Azure subscription id: " -r

az account set --subscription "${REPLY}"
echo $(az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/${REPLY}") >> azure_sp.json
cat azure_sp.json
echo "Created successfully. Saved to azure_sp.json."