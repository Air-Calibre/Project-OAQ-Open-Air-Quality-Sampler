# Project OAQ: Firmware

This folder contains the Arduino firmware required to operate the **Project OAQ (GoodOne V1)** sampler. Depending on the particulate matter sensor installed in your device, upload the corresponding firmware file to the XIAO ESP32C3 microcontroller.

---

## Available Firmware Versions

- `ZH03_Firmware.ino`  
  Use this if your device is equipped with the ZH03 Particulate Matter Sensor.

- `PMS9003_Firmware.ino`  
  Use this if your device is equipped with the PMS9003 Particulate Matter Sensor.

---

## Core Features

Both firmware versions share the same functionality, differing only in how they parse serial data from their respective particulate sensors.

- **Multi-Screen OLED Display**  
  Displays data across six screens:
  - Main AQI Dashboard  
  - Air Temperature  
  - Relative Humidity  
  - Carbon Monoxide (CO)  
  - PM2.5  
  - PM10  

- **Button Navigation**  
  Interrupt-driven button used to cycle through display screens.

- **BLE Integration**  
  Operates as a Bluetooth Low Energy (BLE) server named `GOOD1-Meter`, broadcasting:
  - Temperature  
  - Humidity  
  - AQI data  

- **Smart AQI Calculation**  
  Computes AQI using both PM2.5 and CO values, selecting the higher value as the final AQI.

- **Audible Alerts**  
  Activates a 1500 Hz buzzer when AQI exceeds 100.

---

## Hardware and Pin Configuration

Ensure the ESP32C3 is wired as follows:

| Component              | ESP32C3 Pin | Notes                          |
|----------------------|------------|--------------------------------|
| I2C OLED SDA         | 8          | 128x64 display                 |
| I2C OLED SCL         | 9          |                                |
| DHT22 Data           | 7          | Temperature and humidity       |
| Buzzer               | 10         | PWM driven                     |
| Push Button          | 3          | Uses `INPUT_PULLUP`            |
| PM Sensor RX         | 20         | UART (HardwareSerial)          |
| PM Sensor TX         | 21         | UART (HardwareSerial)          |
| Analog CO Sensor     | 0          | Analog input (`G1_SENSOR`)     |

---

## Dependencies and Libraries

Install the following libraries using the Arduino IDE Library Manager:

- `Wire.h` (built-in)
- `Adafruit_GFX.h` by Adafruit
- `Adafruit_SSD1306.h` by Adafruit
- `DHT sensor library` by Adafruit
- ESP32 BLE libraries:
  - `BLEDevice.h`
  - `BLEServer.h`
  - `BLEUtils.h`
  - `BLE2902.h`  
  (Included with the ESP32 board package)

---

## Flashing Instructions

1. Open the Arduino IDE  
2. Select board: **XIAO ESP32C3**  
3. Open the appropriate firmware file:
   - `ZH03_Firmware.ino` or  
   - `PMS9003_Firmware.ino`  
4. Connect the XIAO ESP32C3 via USB  
5. Select the correct COM port  
6. Click **Upload**

---
