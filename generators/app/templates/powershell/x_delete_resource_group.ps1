

$name = Read-Host '*** Are you sure you want to delete the entire resource group: "<%= resourceGroup %>"? It is irreversible!!*** (y/n)'
if(($name -like '*y*')){
    "Okay Deleting"
    az account set --subscription "<%= subscription %>"
    az group delete -n "<%= resourceGroup %>"
}else{
    "Okay phew!"
}