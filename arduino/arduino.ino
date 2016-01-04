void setup() {
  Serial.begin(115200);
}

void loop() {
  int sensorValue = analogRead(A0);
  
  Serial.println(sensorValue/4, HEX);
  delay(20);
}
