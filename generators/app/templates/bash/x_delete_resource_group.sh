#!/usr/bin/env bash

read -p "*** Are you sure you want to delete the entire resource group: "<%= resourceGroup %>"? It is irreversible!!*** (y/n)" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Okay Deleting"
    az account set --subscription "<%= subscription %>"
    az group delete -n "<%= resourceGroup %>"
fi
