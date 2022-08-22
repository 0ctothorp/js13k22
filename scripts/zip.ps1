# compress dist contents to zip and force write if ./zipped.zip already exists
Compress-Archive -Force -Path .\dist\* -DestinationPath .\zipped.zip
# prints file size in KB
Write-Host((Get-Item .\zipped.zip).length/1KB)