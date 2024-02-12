import OPi.GPIO as GPIO
from relays import Relay
BUTTONS = []

class Button(Relay):
    def __init__(self):
        super().__init__()
        self.buttons = BUTTONS
        self.setupRelay()
        self.setupButtons()
    def setupButtons(self):
        for btn in self.buttons:
            GPIO.setup(int(btn), GPIO.IN,pull_up_down=GPIO.PUD_UP) #button
            GPIO.add_event_detect(int(btn), GPIO.BOTH, callback=self.detectBtnEvent,bouncetime=200)
    def detectBtnEvent(self,channel):
        btn_index = self.buttons.index(channel)
        relay = self.relays[btn_index]
        self.activeRelay(relay)