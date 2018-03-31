#!/usr/bin/env bash
loc=$PWD

if [[ $loc = *"/bash"* ]]; then
  cd ..
fi

loc=$PWD

fullPath="${loc}/_output/<%= dnsPrefix %>/kubeconfig/kubeconfig.<%= azureRegion %>.json"

export KUBECONFIG=$fullPath

echo "Setting kubectl config path to: ${fullPath}"

kubectl cluster-info