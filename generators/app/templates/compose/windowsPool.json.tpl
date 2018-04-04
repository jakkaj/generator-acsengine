
    {
        "name": "windowspool2",
        "count": <%= windowsInstances %>,
        "vmSize": "Standard_D2_v2",
        "availabilityProfile": "AvailabilitySet",
        "osType": "Windows",
        "OSDiskSizeGB": 200,
        "storageProfile" : "ManagedDisks"
    }