## Install sequelize

npm install sequelize
npm install sequelize-cli -g

sequelize init => to initialize seq

sequelize db:

## Create some helpers to manage all data that have to be calculated

## Revoir le cron pour l'utiliser dans des fonctions du module Ticket

- CRON pour mettre a jour les tickets qui sont expirés -> la variable disabled à true
  - un ticket est expiré quand son limitUptime = uptime
  - Aussi si la date d'expiration est atteinte
    - A la création du ticket mettre la variable expiration a null
    - Rajouter un attribut nbreJours
    - utiliser l'attribut nbreJours pour mettre a jour la variable expiration avec la date d'expiration
      - Mais le faire uniquement lorsque l'utilisateur s'est connecté une fois, cela est vérifiable par la variable uptime.
- Un cron pour valider l'expiration d'un ticket - pour les dates -> passer disabled à true
- Un cron pour supprimer les tickets de la base de données du mikrotik, et passer les tickets de la BD à archive
  -Corriger l'affichage pour les logs
- Corriger les informations concernant les tickets expirés
- creer un dossier public/docs et ajouter à gitignore l'info pour ne pas synchroniser les fichiers intérieurs

http://localhost:4000/api/tickets/buyOneTicket?time=03:00:00&price=200

# run pm2 script

pm2 start npm --name "{app_name}" -- run {script_name}
1.- pm2 start "ejemplo.js"
2.- pm2 save
3.- pm2 startup
4.- sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi

#my app password
bNS63y9b6pB55rVe3PtZ

canvas resolution problem
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
---- pour canvas , eventuellement ajouter: apt-get install python2.7

Supprimer Node JS
sudo apt-get remove nodejs
sudo apt-get remove npm
Then go to /etc/apt/sources.list.d and remove any node list if you have. Then do a
sudo apt-get update


# Pour demain

set non vendu avec gen multiple

# App code

```cmd
dFuXAU9UT9NFTBQyNpq5
```

sequelize model:generate --name Recharge --attributes service_id:integer,montant:integer,commission:integer


sqlite instll problem
npm install sqlite3 --unsafe-perm

-- install mosquitto 
npm install mosquitto mosquitto-clients
after
sudo systemctl enable mosquitto.service
pi@raspberry:~$ sudo nano /etc/mosquitto/mosquitto.conf
add these lines:
listener 1883
allow_anonymous true

Remove mosquitto
sudo apt-add-repository --remove ppa:mosquitto-dev/mosquitto-ppa


## github personal code
````
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
````

````bash
chmod +x install.sh
````
````bash
./install.sh
````