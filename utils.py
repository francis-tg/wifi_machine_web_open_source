#!/usr/bin/env python
# -*- coding: utf-8 -*-
import subprocess
from time import sleep
import sys,json,socket
import OPi.GPIO as GPIO

count = 0
def send_post_request(url, json_data):
    try:
        headers = {'Content-type': 'application/json'}
        response = requests.post(url, data=json.dumps(json_data), headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            print("Failed to send POST request. Status code: %s" % response.status_code)
    except requests.RequestException as e:
        print("An error occurred: %s" % e)
    return None
def get_local_ip():
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        return local_ip
    except socket.error as e:
        print("An error occurred: %s" % e)
    return None
def detecter_piece(channel):
    global count
    if GPIO.input(int(sys.argv[2])):
        count +=10
        print("Pièce détectée! "+str(count))
    else:
        print("Aucune pièce détectée.")

# Configuration de l'interruption sur la broche du monnayeur

def detectBtnPush(channel):
    global count
    subprocess.Popen(["node","ticketVending.js",str(count)])
    #send_post_request(url="http://"+get_local_ip()+":4000/api/tickets/buy", json_data={"price":count})
    count = 0
    sleep(1)

def getCredit():
    global count
    return count