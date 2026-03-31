* **This is Project OAQ an Open source Air Quality Sampler made for Everyone**

* Air pollution kills ~7M people every year, and everybody under the living atmosphere of this planet gets affected by it.
* The biggest issue with Air Pollution is a lack of awareness about its constituents, we want to change that.
* Hence, we designed Project OAQ to be a portable, battery powered air pollution monitor, indicating AQI values as well as concentrations of the most influential pollutants.

* Our sensors do not only show air pollution values but also provide call to actions to help mitigate the problem by reducing exposure or using purifiers. We tried to design OAQ in the form factor of an everyday carry gadget so that individuals can find it comfortable to carry anywhere that they travel.

* We also understand that everyone does not have access to the same particulate matter sensors across the globe, Particulate matter sensors start from $3 and go all the way to $60, designing a separate enclosure and pcb for each of these is not feasible, so we selected the best usable sensors off the market and made project OAQ such that it will work with all of them, these are the sensors that OAQ supports currently but the list will keep increasing.

* So you only need to source components of your choice and print relevant holders for it, OAQ works with all of them, in a single, simple design.
* The PCB of OAQ has been made super small to reduce costs and does not use any SMD components, so that anybody with even a simple soldering iron can assemble an OAQ Sampler.

* Project OAQ is also battery powered with an 18650 cell inside, which is rechargeble and also removable for replacement.

* The PCB of OAQ also has a built in buzzer to provide you alerts in audio format without the need of a smartphone.
* However OAQ tries to send all its data over to our smartphone application, which is also open and does not connect OAQ with the internet, instead OAQ sends data over BLE without intrusion.

* We want individuals using OAQ to share their polllution data with the world for a community driven mitigation action, so if you enable sharing your sensors data, Project Good1 will collect data from you as well as multiple such sensors across the world to publish this shared knowledge to various open map dashboards, so that people without access to an air pollution sensor can also be aware about their local environments, your precise location however is not revealed in doing so as the location resolution is limited to a 100 meter radius and is a little time delayed.

* Taking this mitigation action one step further, we are working upon integrating a standalone meshnetwork within each OAQ Sampler, this means all OAQ sensors will be able to work with meshtastic networks for a decentralized pollution dashboard along with emergency communication capabilities useful during environmental disasters and quick relief actions. This standalone grid also enables messaging capabilites for users of Project OAQ while contributing to a good cause.

* We firmly believe that access to clear Air is a fundamental human right and this is our step towards achieving it by increasing awareness about the problem, you can make an OAQ Sampler of your own and Join the mission, further details on our Github and website. 

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
