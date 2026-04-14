# Project OAQ: 3D Printed Enclosure

This folder contains all the 3D printable files (`.stl` and `.3mf`) required to build the physical enclosure for the **Project OAQ** sampler. The enclosure is designed to be modular, allowing you to swap out internal holders based on the specific particulate matter sensor you are using.

## Printing Instructions

To make an OAQ Sampler of your own, you need to 3D print all the individual common files in this root `Enclosure` folder. Then, based on the particulate matter sensor you are using, 3D print the corresponding holder frame from its respective subfolder.

### Building with the PMS9003 Sensor
If you want to use the **PMS9003 Sensor** within Project OAQ, you will need to print:
1. All the common enclosure files listed below.
2. The specific sensor holder frame found in the `/PMS9003_Holder/` directory.

---

## Directory Structure & Components

The assembly of Project OAQ consists of several key physical components. The files provided map directly to these parts:

### Common Base Files (Required for all builds)
These files remain the exact same regardless of which sensor you choose to install:
* **`FrontCover.3mf`** - The Top Cover of the enclosure.
* **`BackCover.stl`** - The Bottom Cover of the enclosure.
* **`OLED_Spacer.stl`** - Spacer for mounting the display.
* **`Button_Big.stl`** - Button component.
* **`RoundButton_Slit.stl`** - Button component.
* **`SmallButton.stl`** - Button component.

### Sensor-Specific Folders
* **`/PMS9003_Holder/`** - Contains the sensor holder frame specifically for the PMS9003 Particulate Matter Sensor.
* **`/ZH03_Holder/`** - Contains the sensor holder frame for the ZH03 Particulate Matter Sensor.

---

## Assembly Overview

Once you have printed the common files and your chosen sensor holder (e.g., the PMS9003 holder), the full assembly of Project OAQ consists of the following components:

1. **Top Cover** (`FrontCover.3mf`)
2. **Bottom Cover** (`BackCover.stl`)
3. **Buttons** (Using the three button `.stl` files)
   * a. Power Button
   * b. Function Button
   * c. Buzzer Button
4. **Sensor Holder** (From your chosen subfolder, e.g., `/PMS9003_Holder/`)
