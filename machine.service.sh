#!/bin/bash

# Nom du service
service_name="machine"

# Chemin absolu du script Python
script_path="/root/wifi_machine/boot.sh"

# Chemin absolu du répertoire contenant le script Python
working_directory="/root/wifi_machine/"

# Nom de l'utilisateur qui exécutera le service (optionnel)
user="root"

# Groupe de l'utilisateur qui exécutera le service (optionnel)
group="root"

# Créer un fichier de service
cat <<EOF | sudo tee "/etc/systemd/system/${service_name}.service" > /dev/null
[Unit]
Description=Machienà wifi

[Service]
ExecStart=${script_path}
WorkingDirectory=${working_directory}
Restart=always
User=${user}
Group=${group}

[Install]
WantedBy=multi-user.target
EOF

# Recharger la configuration de systemd
sudo systemctl daemon-reload

# Activer le service pour qu'il démarre automatiquement au démarrage du système
sudo systemctl enable "${service_name}"

# Démarrer le service
sudo systemctl start "${service_name}"

# Afficher l'état du service
sudo systemctl status "${service_name}"
