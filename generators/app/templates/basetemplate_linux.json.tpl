
{
  "apiVersion": "vlabs",
  "properties": {
    "orchestratorProfile": {
      "orchestratorType": "Kubernetes",
      "orchestratorRelease": "1.9",
      "kubernetesConfig": {
        "apiServerConfig": {
          "--admission-control": "NamespaceLifecycle,ServiceAccount,DefaultStorageClass,DefaultTolerationSeconds,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,AlwaysPullImages"
        }
      } 
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
