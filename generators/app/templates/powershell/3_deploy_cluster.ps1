$loc = Get-Location
if(($loc -like '*powershell*')){
    Set-Location -Path .. -PassThru
}

az account set --subscription "<%= subscription %>"

az group deployment create `
    --name "<%= dnsPrefix %>acsdeployment" `
    --resource-group "<%= resourceGroup %>" `
    --template-file "./_output/<%= dnsPrefix %>/azuredeploy.json" `
    --parameters "./_output/<%= dnsPrefix %>/azuredeploy.parameters.json"