Write-Output "Creating a test file with admin privileges"
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "echo", "This is a test file" -Verb RunAs
Write-Output "Updating Chocolatey"
choco upgrade all -y
