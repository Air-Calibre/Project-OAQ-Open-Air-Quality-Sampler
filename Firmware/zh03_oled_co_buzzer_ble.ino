#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

#define RX_PIN 4
#define TX_PIN 5
#define CO_PIN 0
#define BUZZER_PIN 4

HardwareSerial zhSerial(1);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

BLECharacteristic *pCharacteristic;
bool deviceConnected = false;

float pm25 = 0, pm10 = 0, co = 0;

#define SERVICE_UUID "1234"
#define CHAR_UUID "5678"

class MyCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer*) { deviceConnected = true; }
  void onDisconnect(BLEServer*) { deviceConnected = false; }
};

void setup() {
  Serial.begin(115200);
  zhSerial.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);

  pinMode(BUZZER_PIN, OUTPUT);
  analogSetPinAttenuation(CO_PIN, ADC_11db);

  Wire.begin(8,9);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  uint8_t cmd[] = {0xFF,0x01,0x78,0x40,0x00,0x00,0x00,0x00,0x47};
  zhSerial.write(cmd,9);

  BLEDevice::init("AirMonitor");
  BLEServer *server = BLEDevice::createServer();
  server->setCallbacks(new MyCallbacks());

  BLEService *service = server->createService(SERVICE_UUID);
  pCharacteristic = service->createCharacteristic(
    CHAR_UUID,
    BLECharacteristic::PROPERTY_NOTIFY | BLECharacteristic::PROPERTY_READ
  );

  pCharacteristic->addDescriptor(new BLE2902());
  service->start();
  BLEDevice::getAdvertising()->start();
}

void readZH03() {
  while (zhSerial.available() >= 2) {
    if (zhSerial.read() == 0xFF) {
      if (zhSerial.read() == 0x86) {
        uint8_t buf[22];
        zhSerial.readBytes(buf, 22);

        pm25 = ((buf[2] << 8) | buf[3]) / 10.0;
        pm10 = ((buf[4] << 8) | buf[5]) / 10.0;
        return;
      }
    }
  }
}

void loop() {
  readZH03();

  int adc = analogRead(CO_PIN);
  co = (adc / 4095.0) * 3.3;

  if (pm25 > 100) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(200);
    digitalWrite(BUZZER_PIN, LOW);
  }

  display.clearDisplay();
  display.setCursor(0,0);
  display.printf("PM2.5: %.1f\nPM10: %.1f\nCO: %.2f", pm25, pm10, co);
  display.display();

  String data = String(pm25) + "," + String(pm10) + "," + String(co);

  if (deviceConnected) {
    pCharacteristic->setValue(data.c_str());
    pCharacteristic->notify();
  }

  Serial.println(data);

  delay(500);
}