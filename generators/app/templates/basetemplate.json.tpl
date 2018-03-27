
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
        "name": "linuxpool1",
        "count": <%= linuxInstances %>,
        "vmSize": "Standard_D2_v2",
        "availabilityProfile": "AvailabilitySet"        
      },
      {
        "name": "windowspool2",
        "count": <%= windowsInstances %>,
        "vmSize": "Standard_D2_v2",
        "availabilityProfile": "AvailabilitySet",
        "osType": "Windows",
        "OSDiskSizeGB": 200,
        "storageProfile" : "ManagedDisks"
      }
    ],
    "windowsProfile": {
      "adminUsername": "azureuser",
      "adminPassword": "<%= adminPassword %>"
    },
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
