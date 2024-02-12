#!/usr/bin/env python
# -*- coding: utf-8 -*-
import subprocess
import OPi.GPIO as GPIO
from time import sleep,time       # this lets us have a time delay
import sys
from utils import detecter_piece,detectBtnPush

count =0
WAIT_TIME = 5  # en secondes, ajustez selon vos besoins
# Variable pour stocker le temps du dernier changement de compteur
last_change_time = time()
GPIO.setboard(GPIO.H616)    # Orange Pi ZERO 2 processor H616 board
GPIO.setmode(GPIO.BOARD)        # set up BOARD BCM numbering
GPIO.setup(int(sys.argv[2]), GPIO.IN,pull_up_down=GPIO.PUD_UP) # Monnayeur
GPIO.setup(int(sys.argv[1]), GPIO.IN,pull_up_down=GPIO.PUD_UP) #button
GPIO.add_event_detect(int(sys.argv[2]), GPIO.RISING, callback=detecter_piece,bouncetime=100)
GPIO.add_event_detect(int(sys.argv[1]), GPIO.BOTH, callback=detectBtnPush,bouncetime=200)
try:
    print ("Press CTRL+C to exit")
    while True:
        # Vérifier si le compteur a changé
	    pass
     
except KeyboardInterrupt:
    GPIO.cleanup()  # Nettoyer GPIO
    print ("Bye.")

