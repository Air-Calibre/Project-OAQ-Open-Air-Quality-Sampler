* **# Project OAQ (Open Air Quality Sampler)**

* Air pollution kills ~7M people/year, most people don’t even know what they’re breathing

* current sensor density ≈ 0.02 / 100m vs recommended ≈ 1 / 100m → ~100x deficit

* idea: make AQI measurement cheap, portable, open, everywhere

---

* **What this is**

  * open source portable AQI sampler
  * measures local air quality in real time
  * built for **accessibility + hackability + actual usage**
  * works offline, no cloud dependency

---

* **Core Tech**

  * MCU-based compact PCB (52mm × 30mm)
  * full **through-hole design (no SMD)**
  * BLE for data transfer
  * 18650 Li-ion powered (portable, rechargeable)
  * modular sensor architecture

---

* **Sensors (minimum AQI stack)**

  * Temperature + Humidity → DHT22
  * Gas sensing → MQ-135 (CO₂/VOC proxy)
  * Particulate Matter (user choice)

    * ZH03
    * PMS5003 / PMS9003
    * SPS30
    * SDS011
    * MPM14
    * ZH06

---

* **AQI Logic**

  * calculates sub-index per pollutant
  * final AQI = **max(sub-indices)**
  * uses breakpoint-based linear interpolation
  * sensor fusion used for better context

---

* **Features**

  * under $25 build cost
  * no SMD soldering → easy assembly
  * works with multiple PM sensors
  * real-time AQI + pollutant values
  * buzzer-based alert system (pollution aware UX)
  * BLE app (no internet required)
  * local data logging (.txt)
  * Home Assistant integration ready
  * customizable 3D printed enclosure
  * designed like a **power bank (low attention, EDC friendly)**

---

* **Firmware**

  * simple, community-driven
  * no OTA yet (planned)
  * future: plug-and-play binary support

---

* **App**

  * BLE-based communication
  * shows AQI + all sensor values
  * local logging
  * fully offline

---
