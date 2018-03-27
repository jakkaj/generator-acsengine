$acctList = (az account list)

if(-Not($acctList -like '*tenantId*')){
    az login
}else{
    "You're already logged in"
}

az account set --subscription "<%= subscription %>"

$group="<%= resourceGroup %>"

az group create --name $group --location <%= azureRegion %>
