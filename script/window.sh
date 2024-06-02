$SELECTED_SERVICES = "{{SELECTED_SERVICES}}"
$ACCESS_KEY_ID = "{{ACCESS_KEY_ID}}"
$SECRET_ACCESS_KEY = "{{SECRET_ACCESS_KEY}}"
$ACCOUNT_NUMBER = "{{ACCOUNT_NUMBER}}"

Write-Output "INSTALLATION_STARTED"

Write-Output "Downloading AWS Nuke..."
Invoke-WebRequest -Uri "https://github.com/rebuy-de/aws-nuke/releases/download/v2.16.0/aws-nuke-v2.16.0-windows-amd64.zip" -OutFile "aws-nuke.zip"

Expand-Archive -Path "aws-nuke.zip" -DestinationPath "."

Move-Item -Path ".\aws-nuke-v2.16.0-windows-amd64\aws-nuke.exe" -Destination "C:\Program Files\aws-nuke\aws-nuke.exe"

Remove-Item -Path "aws-nuke.zip"
Remove-Item -Recurse -Path ".\aws-nuke-v2.16.0-windows-amd64"

Write-Output "INSTALLATION_COMPLETED"
Write-Output "EXECUTION_STARTED"

$ConfigPath = "$HOME\aws-nuke-tool\nuke-config.yml"

$ConfigContent = @"
regions:
  - global
  - us-east-1

account-blocklist:
  - "999999999999"

accounts:
  "$ACCOUNT_NUMBER":
"@

If ($SELECTED_SERVICES) {
  $ConfigContent += @"
resource-types:
  targets:
"@
  $SELECTED_SERVICES.Split(",") | ForEach-Object {
    $ConfigContent += "    - `"$($_)`"`n"
  }
}

$ConfigContent | Out-File -FilePath $ConfigPath -Force

$Env:AWS_ACCESS_KEY_ID = $ACCESS_KEY_ID
$Env:AWS_SECRET_ACCESS_KEY = $SECRET_ACCESS_KEY

aws-nuke -c $ConfigPath --no-dry-run --force

Write-Output "EXECUTION_COMPLETED"

Write-Output "Cleaning up..."
Remove-Item -Recurse -Path "$HOME\aws-nuke-tool"
Write-Output "Cleanup completed."
