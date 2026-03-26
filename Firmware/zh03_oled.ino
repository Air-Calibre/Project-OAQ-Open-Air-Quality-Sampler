#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

#define RX_PIN 4
#define TX_PIN 5

HardwareSerial zhSerial(1);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

float pm25 = 0, pm10 = 0;

void setup() {
  Serial.begin(115200);
  zhSerial.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);

  Wire.begin(8, 9);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();

  // Force active mode
  uint8_t cmd[] = {0xFF,0x01,0x78,0x40,0x00,0x00,0x00,0x00,0x47};
  zhSerial.write(cmd,9);
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

  display.clearDisplay();
  display.setTextSize(2);
  display.setCursor(0, 10);
  display.print("PM2.5:");
  display.println(pm25);

  display.print("PM10:");
  display.println(pm10);

  display.display();

  Serial.printf("PM2.5=%.1f PM10=%.1f\n", pm25, pm10);

  delay(500);
}