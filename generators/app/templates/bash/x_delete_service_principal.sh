#!/usr/bin/env bash

read -p "*** Are you sure you want to delete the principal with id: "<%= spClientId %>"? It is irreversible!!*** (y/n)" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Okay Deleting"
    az account set --subscription "<%= subscription %>"
    az ad sp delete --id "<%= spClientId %>"
fi
