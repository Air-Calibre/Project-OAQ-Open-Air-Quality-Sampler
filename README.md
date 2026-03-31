* **This is Project OAQ an Open source Air Quality Sampler made for Everyone**

 <img width="270" height="270" alt="1 (22)" src="https://github.com/user-attachments/assets/e7cd33f5-f574-41b6-9e3c-5ea07c8e1566" /> 
 <img width="270" height="270" alt="1 (14)" src="https://github.com/user-attachments/assets/fed37364-3d43-4a97-990f-3e86e5e9a045" />


* Air pollution kills ~7M people every year, and everybody under the living atmosphere of this planet gets affected by it.
* The biggest issue with Air Pollution is a lack of awareness about its constituents, we want to change that.
* Hence, we designed Project OAQ to be a portable, battery powered air pollution monitor, indicating AQI values as well as concentrations of the most influential pollutants.

* idea: make AQI measurement cheap, portable, open, everywhere
<img width="270" height="270" alt="1 (27)" src="https://github.com/user-attachments/assets/b3caebed-b158-4fcf-9fc4-11b7a9983dc4" />



---

* **What exactly is Project OAQ ?**
<img width="270" height="270" alt="1 (15)" src="https://github.com/user-attachments/assets/2efc71ea-2a32-4f02-8846-cf10d8ec9706" />
<img width="270" height="270" alt="1 (25)" src="https://github.com/user-attachments/assets/ae7b01b6-a04a-420a-af01-f062ef11b40a" />


  * open source portable AQI sampler
  * measures local air quality in real time
  * built for **accessibility + hackability + actual usage**
  * works offline, no cloud dependency

---

* **Core Tech**
<img width="270" height="270" alt="1 (4)" src="https://github.com/user-attachments/assets/c3cfac50-8f5a-407d-ba04-09b656cd9614" />
<img width="270" height="270" alt="1 (36)" src="https://github.com/user-attachments/assets/1f9e93d0-9689-4fb0-9254-1bcc51ef5643" />


  * MCU-based compact PCB (52mm × 30mm)
  * full **through-hole design (no SMD)**
  * BLE for data transfer
  * 18650 Li-ion powered (portable, rechargeable)
  * modular sensor architecture

---
<img width="270" height="270" alt="1 (34)" src="https://github.com/user-attachments/assets/a8b3a2f8-967e-4831-88e4-8b7293b2f05c" />
<img width="270" height="270" alt="1 (2)" src="https://github.com/user-attachments/assets/5acb9e5b-7ca4-4bf6-9686-dcaf389185f6" />

* **Sensors used inside are**

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
<img width="270" height="270" alt="1 (35)" src="https://github.com/user-attachments/assets/166a1d47-1367-4a23-a030-21b6a0f3a89f" />
<img width="270" height="270" alt="1 (19)" src="https://github.com/user-attachments/assets/2fdc1683-0cd1-42a4-a2b5-cee5429d3b62" />



* **AQI Measurement Logic**

  * calculates sub-index per pollutant
  * final AQI = **max(sub-indices)**
  * uses breakpoint-based linear interpolation
  * sensor fusion used for better context

---
<img width="270" height="270" alt="1 (6)" src="https://github.com/user-attachments/assets/aac6d53a-80e3-45f7-8e9b-1d698bf6d31c" />
<img width="270" height="270" alt="1 (20)" src="https://github.com/user-attachments/assets/f6c0d178-e630-493c-a61a-c83ba9701a86" />
<img width="270" height="270" alt="1 (37)" src="https://github.com/user-attachments/assets/8dbb29c1-0578-4937-9a85-4d289cd6bd7b" />


* **Features**

<img width="270" height="270" alt="1 (9)" src="https://github.com/user-attachments/assets/106ad419-4c55-4b90-a8a4-613d380017bd" />
<img width="270" height="270" alt="1 (11)" src="https://github.com/user-attachments/assets/94248a1f-769d-443d-82af-b1b1fe994cea" />

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
<img width="270" height="270" alt="1 (4)" src="https://github.com/user-attachments/assets/51c5ed93-8d08-4bde-8553-4f9dc1cee8ae" />
<img width="270" height="270" alt="1 (5)" src="https://github.com/user-attachments/assets/647abab7-d60e-4891-b6d5-917cbda8f564" />

* **Firmware**

  * simple, community-driven
  * no OTA yet (planned)
  * future: plug-and-play binary support

---
 
* **App**
<img width="1080" height="1080" alt="Components" src="https://github.com/user-attachments/assets/b1ba8cf3-8a2c-4b2b-bdf0-3042b6df3910" />


  * BLE-based communication
  * shows AQI + all sensor values
  * local logging
  * fully offline

---
