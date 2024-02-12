import OPi.GPIO as GPIO
RELAYS = []

class Relay:
    def __init__(self) -> None:
        self.relays = RELAYS
        self.relay_active = GPIO.LOW
        self.relay_disable = GPIO.HIGH
    def setupRelay(self):
        for relay in self.relays:
            GPIO.setup(relay, GPIO.OUT)
            self.disableRelay(relay)
    def activeRelay(self,channel):
        GPIO.ouput(channel,self.relay_active)

    def disableRelay(self,channel):
        GPIO.ouput(channel,self.relay_disable)