# Modify the following lines to match your project setup
PM2_APP_NAME="server"
PM2_APP_PATH="./server.js"
PM2_APP_ENV="production"
# Set PM2 configuration for your application
pm2 init
# Set PM2 configuration for your application
pm2 start $PM2_APP_PATH --name $PM2_APP_NAME --env $PM2_APP_ENV
pm2 save
# Generate startup script for PM2
pm2 startup
# Display PM2 status
pm2 status
