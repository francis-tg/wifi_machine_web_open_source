#!/bin/bash

# Liste des GPIO à configurer
gpios=(11 13 15 19 21 23)

# Activer et configurer chaque GPIO en mode sortie et HIGH
for gpio in "${gpios[@]}"; do
    echo "$gpio" > /sys/class/gpio/export
    echo "out" > /sys/class/gpio/gpio$gpio/direction
    echo "1" > /sys/class/gpio/gpio$gpio/value
done

python /root/wifi_machine/machine.py 12 7