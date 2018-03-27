
{
  "apiVersion": "vlabs",
  "properties": {
    "orchestratorProfile": {
      "orchestratorType": "Kubernetes"
    },
    "masterProfile": {
      "count": 1,
      "dnsPrefix": "<%= dnsPrefix %>",
      "vmSize": "Standard_D2_v2"
    },
    "agentPoolProfiles": [      
      {
        "name": "linuxpool",
        "count": <%= linuxInstances %>,
        "vmSize": "Standard_D2_v2",
        "availabilityProfile": "AvailabilitySet"        
      }
    ],
    "linuxProfile": {
      "adminUsername": "azureuser",
      "ssh": {
        "publicKeys": [
          {
            "keyData": "<%= sshPublicKey %>"
          }
        ]
      }
    },
    "servicePrincipalProfile": {
      "clientId": "<%= spClientId %>",
      "secret": "<%= spSecret %>"
    }
  }
}
