<div align="center">

# Project OAQ
**The Open-Source Air Quality Sampler Made for Everyone.**

[![FOSSHack 2026](https://img.shields.io/badge/FOSSHack-2026-blueviolet?style=for-the-badge)](https://fosshack.in)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0)
[![Open Source Hardware](https://img.shields.io/badge/Hardware-Open_Source-green?style=for-the-badge&logo=open-hardware)](https://oshw-association.org/)
[![Build Cost](https://img.shields.io/badge/Build_Cost-Under_$25-success?style=for-the-badge&logo=cashapp)](#)

<img width="400" alt="OAQ Showcase" src="https://github.com/user-attachments/assets/e7cd33f5-f574-41b6-9e3c-5ea07c8e1566" />

*Make AQI measurement cheap, portable, open, and everywhere.*

</div>

---

## The Problem
Air pollution claims approximately 7 million lives every year. Everyone breathing the atmosphere of this planet is affected by it. Yet, the biggest barrier to combating air pollution is a simple lack of localized awareness about its constituents. 

**We want to change that.**

## The Solution: Project OAQ
Project OAQ is a fully open-source, portable, and battery-powered air pollution monitor. It provides real-time AQI values and the exact concentrations of the most influential airborne pollutants. Built for accessibility, hackability, and actual daily usage.

<div align="center">
  <img width="270" height="270" src="https://github.com/user-attachments/assets/fed37364-3d43-4a97-990f-3e86e5e9a045" />
  <img width="270" height="270" src="https://github.com/user-attachments/assets/b3caebed-b158-4fcf-9fc4-11b7a9983dc4" />
  <img width="270" height="270" src="https://github.com/user-attachments/assets/2efc71ea-2a32-4f02-8846-cf10d8ec9706" />
</div>

---

## Key Features

- **Ultra-Affordable:** Build it yourself for under $25.
- **Zero SMD Soldering:** 100% Through-hole PCB design makes it the perfect weekend project for beginners and schools.
- **Everyday Carry (EDC):** Designed to look and feel like a standard power bank. Low attention, highly portable, powered by a standard rechargeable 18650 Li-ion battery.
- **Privacy First (100% Offline):** No cloud dependency. Connects via Bluetooth Low Energy (BLE) to a local app.
- **Pollution-Aware UX:** Features a built-in buzzer alert system to notify you when air quality reaches dangerous levels.
- **Smart Home Ready:** Easily integrates with Home Assistant for home automation based on air quality triggers.
- **Customizable Enclosure:** 3D printable files included.

---

## Core Technology and Hardware

Our hardware is built around a custom, compact MCU-based PCB measuring just 52mm × 30mm. It utilizes a modular sensor architecture, allowing you to choose the particulate sensor that fits your budget and availability.

<div align="center">
  <img width="270" height="270" src="https://github.com/user-attachments/assets/c3cfac50-8f5a-407d-ba04-09b656cd9614" />
  <img width="270" height="270" src="https://github.com/user-attachments/assets/1f9e93d0-9689-4fb0-9254-1bcc51ef5643" />
  <img width="270" height="270" src="https://github.com/user-attachments/assets/b1ba8cf3-8a2c-4b2b-bdf0-3042b6df3910" />
</div>

### Supported Sensors
| Measurement Type | Supported Sensors |
| :--- | :--- |
| **Temperature and Humidity** | `DHT22` |
| **Gas / CO2 / VOC Proxy** | `MQ-135` |
| **Particulate Matter (PM)** | `ZH03`, `PMS5003 / PMS9003`, `SPS30`, `SDS011`, `MPM14`, `ZH06` |

---

## How We Calculate AQI

Project OAQ doesn't just guess; it relies on solid math and sensor fusion:
1. Calculates a sub-index for each detected pollutant.
2. Uses breakpoint-based linear interpolation to standardize values.
3. Applies sensor fusion for enriched context.
4. Determines the Final AQI: Final AQI = max(sub-indices).

<div align="center">
  <img width="270" height="270" src="https://github.com/user-attachments/assets/166a1d47-1367-4a23-a030-21b6a0f3a89f" />
  <img width="270" height="270" src="https://github.com/user-attachments/assets/2fdc1683-0cd1-42a4-a2b5-cee5429d3b62" />
  <img width="270" height="270" src="https://github.com/user-attachments/assets/5acb9e5b-7ca4-4bf6-9686-dcaf389185f6" />
</div>

---

## Software and Ecosystem

### The Firmware
- **Simple and Community-Driven:** Codebase designed for readability.
- **Future Roadmap:** Over-The-Air (OTA) updates and plug-and-play binary support are currently in development.

### The Mobile App
- **BLE Communication:** Fast, low-power pairing.
- **Comprehensive Dashboards:** View AQI alongside raw data from all individual sensors.
- **Local Logging:** Exports data locally as .txt files for your own data science projects.

<div align="center">
  <img width="270" height="270" src="https://github.com/user-attachments/assets/51c5ed93-8d08-4bde-8553-4f9dc1cee8ae" />
  <img width="270" height="270" src="https://github.com/user-attachments/assets/647abab7-d60e-4891-b6d5-917cbda8f564" />
  <img width="270" height="270" src="https://github.com/user-attachments/assets/106ad419-4c55-4b90-a8a4-613d380017bd" />
</div>

---

## Gallery

<div align="center">
  <img width="270" height="270" src="https://github.com/user-attachments/assets/ae7b01b6-a04a-420a-af01-f062ef11b40a" />
  <img width="270" height="270" src="https://github.com/user-attachments/assets/94248a1f-769d-443d-82af-b1b1fe994cea" />
  <img width="270" height="270" src="https://github.com/user-attachments/assets/aac6d53a-80e3-45f7-8e9b-1d698bf6d31c" />
  <img width="270" height="270" src="https://github.com/user-attachments/assets/f6c0d178-e630-493c-a61a-c83ba9701a86" />
  <img width="270" height="270" src="https://github.com/user-attachments/assets/8dbb29c1-0578-4937-9a85-4d289cd6bd7b" />
  <img width="270" height="270" src="https://github.com/user-attachments/assets/a8b3a2f8-967e-4831-88e4-8b7293b2f05c" />
</div>

---

## Contributing
We built this for FOSSHACK 2026, but the mission extends far beyond one event. We welcome pull requests, new sensor integrations, app UI improvements, and 3D enclosure remixes! 

## License
This project is licensed under the **GNU General Public License v3.0**. 

> You are free to copy, modify, and distribute this software, but you must keep all derivative works under the same GPLv3 license and provide the source code. See LICENSE for full details.
