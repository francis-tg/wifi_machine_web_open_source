#!/usr/bin/env python
# -*- coding: utf-8 -*-
import subprocess
import OPi.GPIO as GPIO
from time import sleep,time       # this lets us have a time delay
import sys
from utils import detectBtnPush, detecter_piece,getCredit
import buttons
count = 0
WAIT_TIME = 5  # en secondes, ajustez selon vos besoins
# Variable pour stocker le temps du dernier changement de compteur
last_change_time = time()
GPIO.setboard(GPIO.H616)    # Orange Pi ZERO 2 processor H616 board
GPIO.setmode(GPIO.BOARD)        # set up BOARD BCM numbering
GPIO.setup(int(sys.argv[2]), GPIO.IN,pull_up_down=GPIO.PUD_UP) # Monnayeur
GPIO.setup(int(sys.argv[1]), GPIO.IN,pull_up_down=GPIO.PUD_UP) #button
GPIO.add_event_detect(int(sys.argv[2]), GPIO.RISING, callback=detecter_piece,bouncetime=100)
GPIO.add_event_detect(int(sys.argv[1]), GPIO.BOTH, callback=detectBtnPush,bouncetime=200)
buttons.Button()
try:
    print ("Press CTRL+C to exit")
    
    while True:
       """ print(getCredit())
       sleep(1) """
       pass
       """  # Vérifier si le compteur a changé
        if GPIO.input(int(sys.argv[2])):
            count +=10
            print("Pièce détectée! "+str(count))
            last_change_time = time()  # Mettre à jour le temps du dernier changement de compteur
        # Vérifier si le temps écoulé depuis le dernier changement est supérieur au temps d'attente
        if (time() - last_change_time) > WAIT_TIME:
            print("Fin du comptage d'argent.")
            # Envoyer le montant compté
            subprocess.Popen(["node","./hardware/coin.js",str(count)])
            #count = 0  # Réinitialiser le compteur
        sleep(1)  # Attendre 1 seconde entre chaque vérification """
except KeyboardInterrupt:
    GPIO.cleanup()  # Nettoyer GPIO
    print ("Bye.")

