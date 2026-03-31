#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "DHT.h"
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <math.h> 

// -------------------- PINS & CONFIG --------------------
#define SDAPIN 8
#define SCKPIN 9
#define DHTPIN 7
#define DHTTYPE DHT22
#define BUZZER_PIN 10
#define BUTTON_PIN 3
#define RX_PIN 20
#define TX_PIN 21
#define G1_SENSOR 0

#define RL_VALUE 10.0      
#define R0_CLEAN_AIR 4.5   

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// -------------------- GLOBALS -------------------------
DHT dht(DHTPIN, DHTTYPE);
HardwareSerial zhSerial(1);
BLECharacteristic *pCharacteristic;

float temperature = 0, humidity = 0, pm25 = 0, pm10 = 0, aqi = 0, co = 0;
uint8_t screenIndex = 0;
volatile bool buttonPressed = false;
volatile unsigned long lastISRTime = 0;
bool deviceConnected = false;

// -------------------- BLE CALLBACKS --------------------
class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) { deviceConnected = true; }
  void onDisconnect(BLEServer* pServer) { 
    deviceConnected = false; 
    BLEDevice::startAdvertising(); 
  }
};

void IRAM_ATTR handleButton() {
  unsigned long now = millis();
  if (now - lastISRTime > 250) {
    buttonPressed = true;
    lastISRTime = now;
  }
}

// -------------------- SENSOR MATH ---------------------
void calculateCO() {
  int rawADC = analogRead(G1_SENSOR);
  float volt = (rawADC / 4095.0) * 3.3;
  if (volt < 0.1) { co = 0; return; }
  float rs = ((3.3 * RL_VALUE) / volt) - RL_VALUE;
  float ratio = rs / R0_CLEAN_AIR;
  co = 599.48 * pow(ratio, -1.512); 
}

void readPMS9003() {
  static uint8_t buf[32];
  static uint8_t idx = 0;

  while (zhSerial.available()) {
    uint8_t b = zhSerial.read();

    if (idx == 0 && b != 0x42) continue;
    if (idx == 1 && b != 0x4D) { idx = 0; continue; }

    buf[idx++] = b;

    if (idx >= 32) {
      idx = 0;

      // PMS9003 standard atmospheric values
      pm25 = (float)((buf[12] << 8) | buf[13]);
      pm10 = (float)((buf[14] << 8) | buf[15]);

      // Optional extra data if needed
      // float pm1 = (buf[10] << 8) | buf[11];
    }
  }
}

void drawProProgressBar(int currentAqi) {
  int barW = 26; int barH = 5; int gap = 4; int y = 52;
  int levels = 0;
  if (currentAqi > 0)   levels = 1;
  if (currentAqi > 50)  levels = 2;
  if (currentAqi > 100) levels = 3;
  if (currentAqi > 150) levels = 4;

  for (int i = 0; i < 4; i++) {
    int x = 6 + (i * (barW + gap));
    if (i < levels) display.fillRect(x, y, barW, barH, WHITE);
    else display.drawRect(x, y, barW, barH, WHITE);
  }
}

void displayValues() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("GOOD1");

  String status = (aqi <= 50) ? "EXCELLENT" : (aqi <= 100) ? "MODERATE" : (aqi <= 150) ? "POOR" : "CRITICAL";
  int16_t sx1, sy1; uint16_t sw, sh;
  display.getTextBounds(status, 0, 0, &sx1, &sy1, &sw, &sh);
  display.setCursor(SCREEN_WIDTH - sw, 0);
  display.print(status);
  display.drawFastHLine(0, 10, 128, WHITE);

  display.setTextSize(3);
  String aStr = String((int)aqi);
  int16_t x1, y1; uint16_t w, h;
  display.getTextBounds(aStr, 0, 0, &x1, &y1, &w, &h);
  display.setCursor((SCREEN_WIDTH - w) / 2, 18); 
  display.print(aStr);

  display.setTextSize(1);
  display.setCursor(56, 42); display.print("AQI");
  drawProProgressBar((int)aqi);
  display.display();
}

void showDetail(String label, float val, String unit) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 0); display.print(label);
  display.drawFastHLine(0, 10, 128, WHITE);
  display.setTextSize(3);
  String vStr = String(val, (val > 99 ? 0 : 1));
  int16_t x1, y1; uint16_t w, h;
  display.getTextBounds(vStr, 0, 0, &x1, &y1, &w, &h);
  display.setCursor((128-w)/2, 25);
  display.print(vStr);
  display.setTextSize(1);
  display.setCursor(128 - (unit.length() * 6), 55);
  display.print(unit);
  display.display();
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  zhSerial.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);
  ledcAttach(BUZZER_PIN, 2000, 8); 
  
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), handleButton, FALLING);

  Wire.begin(SDAPIN, SCKPIN);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.setTextColor(WHITE);

  BLEDevice::init("GOOD1-Meter");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());
  BLEService *pService = pServer->createService("4fafc201-1fb5-459e-8fcc-c5c9c331914b");
  pCharacteristic = pService->createCharacteristic("beb5483e-36e1-4688-b7f5-ea07361b26a8", BLECharacteristic::PROPERTY_NOTIFY);
  pCharacteristic->addDescriptor(new BLE2902());
  pService->start();
  pServer->getAdvertising()->start();
}

void loop() {
  readPMS9003();
  
  static unsigned long lastSensorRead = 0;
  if (millis() - lastSensorRead > 2000) {
    temperature = dht.readTemperature();
    humidity = dht.readHumidity();
    calculateCO();
    
    // Weighted AQI logic
    float a_pm = (pm25 / 35.0) * 100.0;
    float a_co = (co / 9.0) * 100.0;
    aqi = max(a_pm, a_co);
    
    if (deviceConnected) {
      String data = String(temperature) + "," + String(humidity) + "," + String(aqi);
      pCharacteristic->setValue(data.c_str());
      pCharacteristic->notify();
    }
    lastSensorRead = millis();
  }

  if (buttonPressed) {
    screenIndex = (screenIndex + 1) % 6;
    buttonPressed = false;
  }

  switch (screenIndex) {
    case 0: displayValues(); break;
    case 1: showDetail("AIR TEMPERATURE", temperature, "C"); break;
    case 2: showDetail("RELATIVE HUMIDITY", humidity, "%"); break;
    case 3: showDetail("CARBON MONOXIDE", co, "PPM"); break;
    case 4: showDetail("PM 2.5", pm25, "ug/m3"); break;
    case 5: showDetail("PM 10", pm10, "ug/m3"); break;
  }
  
  if (aqi > 100 && (millis() % 5000 < 100)) {
     ledcWriteTone(BUZZER_PIN, 1500); delay(50); ledcWriteTone(BUZZER_PIN, 0);
  }
}
