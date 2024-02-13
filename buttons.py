#!/usr/bin/env python
# -*- coding: utf-8 -*-
import OPi.GPIO as GPIO
from relays import Relay
import functools,time,db,utils
BUTTONS = [10,8]

class Button(Relay):
    def __init__(self):
        Relay.__init__(self)
        self.buttons = BUTTONS
        self.setupRelay()
        self.setupButtons()
        self.credit = utils.getCredit()
        
    def setupButtons(self):
        for btn in self.buttons:
            GPIO.setup(int(btn), GPIO.IN, pull_up_down=GPIO.PUD_UP)  # button
            callback_with_var = functools.partial(self.detectBtnEvent, int(btn))
            GPIO.add_event_detect(int(btn), GPIO.BOTH, callback=callback_with_var, bouncetime=200)
            
    def detectBtnEvent(self, btn,channel):
        article = db.getOne("Vendings",["*"],"price={}".format(self.credit))
        print(article)
        btn_index = self.buttons.index(btn)
        relay = self.relays[btn_index]
        self.activeRelay(relay)
        time.sleep(3)
        self.disableRelay(relay)
