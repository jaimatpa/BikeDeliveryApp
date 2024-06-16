# APPLICATION: BULLOCK BIKE APP WEB
# AUTHOR: DEREK ARMSTRONG
# LAST UPDATED: 2023-07-17

# CREATE BACKUP DIRECTORY
echo "CREATING BACKUP DIRECTORY ..."
mkdir /home/ubuntu/backup/bba-$(date +%F)
cd /home/ubuntu/backup/bba-$(date +%F)
echo "DONE"

# BACKUP NGINX CONFIGURATION
echo "BACKING UP NGINX CONFIGURATION ..."
cp -r /etc/nginx/sites-enabled .
echo "DONE"

# BACKUP SSL CERTIFICATE
echo "BACKING UP SSL CERTIFICATES ..."
cp -r /etc/ssl .
echo "DONE"

# BACKUP APPLICATION FILES
echo "BACKING UP CLIENT APPLICATION FILES ..."
rsync -av --progress /var/www/bikeapp/bullock-bike-app-master/bba-client /home/ubuntu/backup/bba-$(date +%F)/bba-client
echo "Done"

echo "BACKING UP SERVER APPLICATION FILES ..."
rsync -av --progress /var/www/bikeapp/bullock-bike-app-master/bba-server /home/ubuntu/backup/bba-$(date +%F)/bba-server --exclude public
echo "DONE"

# COMPRESS BACKUP
echo "COMPRESSING BACKUP FILES ..."
zip -r /home/ubuntu/backup/bba-$(date +%F)/bba.zip /home/ubuntu/backup/bba-$(date +%F)
echo "DONE"

# DELETE RUNNING APPLICATIONS
echo "KILLING CURRENTLY RUNNING APPLICATIONS ..."
npm delete all
echo "DONE"

# EXTRACT SERVER APPLICATION
unzip /home/ubuntu/bba-server.zip -d /var/www/bikeapp/bullock-bike-app-master
# EXTRACT CLIENT APPLICATION
unzip /home/ubuntu/bba-client.zip -d /var/www/bikeapp/bullock-bike-app-master

# ENTER THE SERVER DIRECTORY
cd /var/www/bikeapp/bullock-bike-app-master/bba-server

# COPY ENVIRONMENT FILES
echo "RESTORING ENVIRONMENT CONFIGURATION FILES ..."
cp /home/ubuntu/backup/bba-$(date +%F)/bba-server/.env /var/www/bikeapp/bullock-bike-app-master/bba-server
echo "DONE"

# BUILD THE APPLICATION
echo "BUILDING SERVER APPLICATION ..."
npm install
npm audit fix
npm run build
echo "DONE"

# START THE APPLICATION
echo "STARTING SERVER APPLICATION ..."
pm2 start npm --name "server" -- start
echo "DONE"

# ENTER THE CLIENT DIRECTORY
cd /var/www/bikeapp/bullock-bike-app-master/bba-client

# COPY ENVIRONMENT FILES
cp /home/ubuntu/backup/bba-$(date +%F)/bba-client/.env /var/www/bikeapp/bullock-bike-app-master/bba-client

# BUILD THE APPLICATION
echo "BUILDING CLIENT APPLICATION ..."
npm install
npm audit fix
npm run build
echo "DONE"

# START THE APPLICATION
echo "STARTING CLIENT APPLICATION ..."
pm2 start npm --name "client" -- start
echo "DONE"

# SAVE PM2 CONFIGURATION
echo "SAVING PM2 CONFIGURATION ..."
pm2 save
echo "DONE"