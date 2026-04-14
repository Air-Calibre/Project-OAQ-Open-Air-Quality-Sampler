# Project OAQ: GoodOne V1 PCB

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Hardware](https://img.shields.io/badge/hardware-XIAO_ESP32C3-orange.svg)
![Software](https://img.shields.io/badge/design-EasyEDA-brightgreen.svg)

This repository contains the printed circuit board (PCB) design files, documentation, and manufacturing files for **Project OAQ**, officially titled **GoodOne V1**. Designed by **AirCalibre**, this board is built for environmental and air quality monitoring applications.

---

## Hardware Overview

The GoodOne V1 PCB integrates a microcontroller, multiple environmental sensors, an OLED display, and a rechargeable battery system.

### Core Components

- **Microcontroller:** XIAO ESP32C3 (U1)  
- **Display:** 0.96" 128x64 I2C OLED (U17 / U19 / DISP1)  
- **Audio Output:** BUZZER 3kHz (BUZZER1)  
- **Capacitor:** 100nF (C2)  

### Sensors

- **Temperature & Humidity:** DHT22 (U5)  
- **Particulate Sensor:** B4B-XH-A(LF)(SN) Particulate Sensor (U4)  
- **Secondary Sensor:** B4B-XH-A(LF)(SN) GoodOne Sensor (U2)  

### Power System

- **Battery:** 18650 cell (U3)  
- **Charger Module:** HW-107 (1A 1S Li-Ion TP4056 Charger) (U18)  
- **Power Switches:** SW2 and SW4 7-7 ZS DPDT Latching Buttons  

---

## 🔌 Wiring & Pin Definitions

### I2C Display (OLED)

- **SDA:** Connected to the SDA pin on the ESP32C3 and the OLED display  
- **SCL:** Connected to the SCL pin on the ESP32C3 and the OLED display  
- **Power:** Powered via 3V3 and GND lines  

### Sensors

- **DHT22:** Utilizes the DATA line for communication  
- **Particulate Sensor:** Uses serial communication over TX and RX pins  

### Power Distribution

- **Charging:** The TP4056 charger manages the 18650 battery via BAT+ and BAT- terminals  
- **System Voltage:** Distributes 5V and 3V3 power lines with common GND  
- **Switching:** DPDT switches control power flow across the circuit  

---

## Manufacturing & Fabrication Files

This repository includes industry-standard Gerber and Excellon drill files for direct submission to PCB fabrication houses.  
All files were generated using EasyEDA v6.5.54 on **2026-03-13**.

### Drill Files (.DRL)

- **Drill_NPTH_Through.DRL** – Non-plated through holes  
- **Drill_PTH_Through_Via.DRL** – Plated through vias  
- **Drill_PTH_Through.DRL** – Standard plated through holes  

### Gerber Files

- **Gerber_BoardOutlineLayer.GKO** – Board outline and dimensions  
- **Gerber_TopLayer.GTL** – Top copper traces  
- **Gerber_BottomLayer.GBL** – Bottom copper traces  
- **Gerber_BottomSolderMaskLayer.GBS** – Bottom solder mask  
- **Gerber_BottomSilkscreenLayer.GBO** – Bottom silkscreen  
- **Gerber_BottomPasteMaskLayer.GBP** – Bottom paste mask  
- **Gerber_DocumentLayer.GDL** – Additional documentation layer  

---

## Getting Started

1. Clone this repository to your local machine  
2. Open the project in EasyEDA or import Gerber files into a CAM viewer    
3. Submit `.DRL` and `.G*` files to a PCB manufacturer (e.g., JLCPCB, PCBWay)  

---
