#include <Servo.h>

struct Input {
  int pin;
  int lastValue;
  int value;
  int lastTimestamp;
  int timestamp;
  int duration;
  int frequency;
  int command;
  int lastCommand;
  boolean changed;
};


struct Input inputA = {A1,0,0,0,0,0,0,0,0,false};
struct Input inputB = {A2,0,0,0,0,0,0,0,0,false};
Servo servoA;
Servo servoB;

void setup() {
  Serial.begin(9600);
  setupServo(&servoA, 9);
  setupServo(&servoB, 10);
}

void loop() {
  resolveCommand(&inputA, &servoA);
  resolveCommand(&inputB, &servoB);
}

void resolveCommand(struct Input* i, Servo * s){
  proccessInputCommand(i);
  if(i->changed){
    setServoCommand(s, i->command);
  }
}

void proccessInputCommand(struct Input* i) {
  i->lastValue = i->value;
  i->value = analogRead(i->pin);
  if(i->value == 0 && i->lastValue != 0){
    i->timestamp = millis();
    i->duration = i->timestamp - i->lastTimestamp;
    i->lastTimestamp = i->timestamp;
    i->frequency = 1000.f / (float)i->duration;
    i->lastCommand = i->command;
    
    if (i->frequency > 25 && i->frequency < 35) i->command = 0;
    else if (i->frequency > 35 && i->frequency < 45) i->command = 1;
    else if (i->frequency > 45 && i->frequency < 55) i->command = 2;
    else if (i->frequency > 55 && i->frequency < 65) i->command = 3;
    else if (i->frequency > 65 && i->frequency < 75) i->command = 4;
    
    if(i->lastCommand != i->command) i->changed = true;
   return; 
  }
  i->changed = false;
}

void setupServo(Servo* s, int pin) {
  s->attach(pin);
  setServoCommand(s, 1);
}

void setServoCommand(Servo* s, int command) {
  switch(command){
    case 0:
      s->writeMicroseconds(1300);
      break;
    case 1:
      s->writeMicroseconds(1450);
      break;
    case 2:
      s->writeMicroseconds(1500);
      break;
    case 3:
      s->writeMicroseconds(1550);
      break;
    case 4:
      s->writeMicroseconds(1700);
      break;      
  }
}

