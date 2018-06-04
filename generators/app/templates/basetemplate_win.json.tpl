
{
  "apiVersion": "vlabs",
  "properties": {
    "orchestratorProfile": {
      "orchestratorType": "Kubernetes",
      "orchestratorRelease": "1.9",
      "kubernetesConfig": {
        "apiServerConfig": {
          "--admission-control": "NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,DefaultTolerationSeconds,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota,DenyEscalatingExec,AlwaysPullImages"
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
        "name": "windowspool1",
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
