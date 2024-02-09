#!/bin/bash
#check update
sudo apt update

#install python-dev
sudo apt-get install python-dev -y
#check if git install or install it
if command -v git &> /dev/null; then
  sudo apt install -y git
else 
  echo "Git is already installed"
fi

#check if curl install or install it

if command -v curl &> /dev/null; then
  sudo apt install -y curl
else 
  echo "Curl is already installed"
fi
# install lib for OPI.GPIO ref ===> https://github.com/eutim/OPI.GPIO
git clone https://github.com/eutim/OPI.GPIO
cd OPI.GPIO
sudo python setup.py install
# out of folder
cd
# Install Node.js
# Check if Node.js is installed
if ! command -v node &> /dev/null; then
cd ~
    echo "Installing nodejs"
curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh
sudo apt-get install -y nodejs
else
    echo "Node.js is already installed."
fi
# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "PM2 is not installed. Installing PM2..."
    sudo npm install -g pm2
else
    echo "PM2 is already installed."
fi

# Check if Sequelize CLI is installed
if ! command -v sequelize &> /dev/null; then
    echo "Sequelize CLI is not installed. Installing Sequelize CLI..."
    sudo npm install -g sequelize-cli
else
    echo "Sequelize CLI is already installed."
fi

# Fix canvas
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y


# Modify the following lines to match your project setup
PM2_APP_NAME="server"
PM2_APP_PATH="./server.js"
PM2_APP_ENV="production"

# Clone the private Bitbucket repository
BITBUCKET_USERNAME="Cisco_dev"
BITBUCKET_PASSWORD="dFuXAU9UT9NFTBQyNpq5"
BITBUCKET_REPO_URL="https://Cisco_dev@bitbucket.org/essoham/machine_a_wifi_client_final.git"
git clone $BITBUCKET_REPO_URL
cd machine_a_wifi_client_final

# Authenticate with Bitbucket using credentials
git config credential.helper store
git fetch --all
# Install dependencies
npm install
# create db folder
mkdir db
# migrate db
sequelize db:migrate
echo "db migrate"
# Set PM2 configuration for your application
pm2 init
# Set PM2 configuration for your application
pm2 start $PM2_APP_PATH --name $PM2_APP_NAME --env $PM2_APP_ENV
pm2 save
# Generate startup script for PM2
pm2 startup
# Display PM2 status
pm2 status

echo "Terminer...."