/**
 * BasicHTTPClient.ino
 *
 *  Created on: 24.05.2015
 *
 */

#include <Arduino.h>

#include <WiFi.h>
#include <WiFiMulti.h>

#include <HTTPClient.h>

// Include the libraries we need
#include <OneWire.h>
#include <DallasTemperature.h>

// Data wire is plugged into port 23 on the Arduino
#define ONE_WIRE_BUS 23

// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);

// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);

#define USE_SERIAL Serial
#define SSID_STR "unico101"
#define PASSWD "12601260"

WiFiMulti wifiMulti;

void setup() {
  
  // Start up the library
  sensors.begin();

    USE_SERIAL.begin(115200);

    USE_SERIAL.println();
    USE_SERIAL.println();
    USE_SERIAL.println();

    for(uint8_t t = 4; t > 0; t--) {
        USE_SERIAL.printf("[SETUP] WAIT %d...\n", t);
        USE_SERIAL.flush();
        delay(1000);
    }

    wifiMulti.addAP(SSID_STR, PASSWD);

}

void loop() {
    static int seq = 0;
    
    // wait for WiFi connection
    if((wifiMulti.run() == WL_CONNECTED)) {
        // call sensors.requestTemperatures() to issue a global temperature 
        // request to all devices on the bus
        Serial.print("Requesting temperatures...");
        sensors.requestTemperatures(); // Send the command to get temperatures
        Serial.println("DONE");
        // After we got the temperatures, we can print them here.
        // We use the function ByIndex, and as an example get the temperature from the first sensor only.
        Serial.print("Temperature for the device 1 (index 0) is: ");
        float temp = sensors.getTempCByIndex(0);
        Serial.println(temp);

        HTTPClient http;

        USE_SERIAL.print("[HTTP] begin...\n");
        
        // configure traged server and url
        char url[1024];
        snprintf(url, 1024, "http://ec2-18-209-27-39.compute-1.amazonaws.com:8098/add?device_id=%d&temperature_value=%f&sequence_number=%d", 0, temp, seq);
        http.begin(url); //HTTP

        USE_SERIAL.print("[HTTP] GET...\n");
        // start connection and send HTTP header
        int httpCode = http.GET();

        // httpCode will be negative on error
        if(httpCode > 0) {
            // HTTP header has been send and Server response header has been handled
            USE_SERIAL.printf("[HTTP] GET... code: %d\n", httpCode);

            // file found at server
            if(httpCode == HTTP_CODE_OK) {
                String payload = http.getString();
                USE_SERIAL.println(payload);
            }
        } else {
            USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
        }

        http.end();
    }

    seq++;

    delay(60000);
}
