$loc = Get-Location
if(($loc -like '*powershell*')){
    Set-Location -Path .. -PassThru
}
acs-engine generate buildacs.json