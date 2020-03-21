import requests
import random
import time

for i in range(10):
    value = random.randint(0, 99)
    r = requests.get("https://api.thingspeak.com/update?api_key=ZAVR8HT18XA0Y1ER&field1={}".format(value))
    r.encoding = 'utf8'
    print(r.text)
    time.sleep(20)

