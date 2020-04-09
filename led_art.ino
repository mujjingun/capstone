#include <math.h>

int led[3] = {15, 4, 17};
int gnd[3] = {2, 16, 5};

int trigPin = 22;
int echoPin = 23;

float dist = 0;

void loop() {
  static float tick = 0;
    
  // Clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 29411);
  float distance = duration*0.034/2;
  dist = dist * 0.9 + distance * 0.1;

  if (int(tick) % 3 == 0) {
    digitalWrite(led[0], HIGH);
    digitalWrite(led[1], LOW);
    digitalWrite(led[2], LOW);
  } else if (int(tick) % 3 == 1) {
    digitalWrite(led[1], HIGH);
    digitalWrite(led[0], LOW);
    digitalWrite(led[2], LOW);
  } else if (int(tick) % 3 == 2) {
    digitalWrite(led[2], HIGH);
    digitalWrite(led[1], LOW);
    digitalWrite(led[0], LOW);
  }

  tick += (exp(-dist/10) * 5 + 1) / 20;
  delay(10);
}

void setup() {
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input

  // put your setup code here, to run once:
  for (int i=0; i<3; i++) {
    pinMode(led[i], OUTPUT);
    digitalWrite(led[i], 1);
    
    pinMode(gnd[i], OUTPUT);
    digitalWrite(gnd[i], 0);
  }
  
  Serial.begin(9600);
}
