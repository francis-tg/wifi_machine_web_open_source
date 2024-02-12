import OPi.GPIO as GPIO
RELAYS = [11,13,15,19,21,23]

class Relay:
    def __init__(self):
        self.relays = RELAYS
        self.relay_active = GPIO.LOW
        self.relay_disable = GPIO.HIGH
    def setupRelay(self):
        for relay in self.relays:
            GPIO.setup(relay, GPIO.OUT)
            self.disableRelay(relay)
    def activeRelay(self,channel):
        GPIO.output(channel,self.relay_active)

    def disableRelay(self,channel):
        GPIO.output(channel,self.relay_disable)