#!/bin/bash
SELECTED_SERVICES="{{SELECTED_SERVICES}}"
ACCESS_KEY_ID="{{ACCESS_KEY_ID}}"
SECRET_ACCESS_KEY="{{SECRET_ACCESS_KEY}}"
ACCOUNT_NUMBER="{{ACCOUNT_NUMBER}}"

HOME_DIR="$HOME/aws-nuke-tool"

echo "INSTALLATION_STARTED"

echo "Creating directory at $HOME_DIR"
mkdir -p "$HOME_DIR"
cd "$HOME_DIR"

echo "Downloading AWS Nuke..."
wget -cq https://github.com/rebuy-de/aws-nuke/releases/download/v2.16.0/aws-nuke-v2.16.0-linux-amd64.tar.gz

tar -xvf aws-nuke-v2.16.0-linux-amd64.tar.gz

mv aws-nuke-v2.16.0-linux-amd64 aws-nuke

echo "Enable AWS Nuke Package!"
mv aws-nuke /usr/local/bin/aws-nuke

rm -f aws-nuke-v2.16.0-linux-amd64.tar.gz

echo "INSTALLATION_COMPLETED"
echo "EXECUTION_STARTED"

touch nuke-config.yml

cat > nuke-config.yml <<EOL
regions:
  - global
  - us-east-1

account-blocklist:
  - "999999999999"

EOL

if [ -n "$SELECTED_SERVICES" ]; then
  echo "resource-types:" >> nuke-config.yml
  echo "  targets:" >> nuke-config.yml
  for service in $(echo "$SELECTED_SERVICES" | sed "s/,/ /g")
  do
    echo "    - \"$service\"" >> nuke-config.yml
  done
  echo "" >> nuke-config.yml
fi

echo "accounts:" >> nuke-config.yml
echo "  \"$ACCOUNT_NUMBER\":" >> nuke-config.yml

export AWS_ACCESS_KEY_ID="$ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$SECRET_ACCESS_KEY"

mkdir -p ~/.aws

cat > ~/.aws/credentials <<EOL
[default]
aws_access_key_id = $ACCESS_KEY_ID
aws_secret_access_key = $SECRET_ACCESS_KEY
EOL

aws-nuke -c nuke-config.yml --no-dry-run --force

echo "EXECUTION_COMPLETED"

echo "Cleaning up..."
cd ~
rm -rf "$HOME_DIR"
echo "Cleanup completed."
