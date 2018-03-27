$loc = Get-Location

if(($loc -like '*powershell*')){
    Set-Location -Path .. -PassThru
}

$loc = Get-Location

$fullPath = "$loc\_output\<%= dnsPrefix %>\kubeconfig\kubeconfig.<%= azureRegion %>.json"


$env:KUBECONFIG = $fullPath

Write-Output "Setting kubectl config path to: " $fullPath

kubectl cluster-info