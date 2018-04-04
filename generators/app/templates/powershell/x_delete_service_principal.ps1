

$name = Read-Host '*** Are you sure you want to delete the the principal with id: "<%= spClientId %>"? It is irreversible!!*** (y/n)'
if(($name -like '*y*')){
    "Okay Deleting"
    az account set --subscription "<%= subscription %>"
    az ad sp delete --id "<%= spClientId %>"
}else{
    "Okay phew!"
}