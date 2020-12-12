# Apothekennotdienst

Application to display emergency pharmacy service information.

A pharmacy in Germany is legally required to display at least 2 other nearby pharmacies which are in-service if the pharmacy is closed.

This app displays this information along with the location of the other nearby pharmacies on a map.

## System setup

The pharmacy uses a cheap LCD monitor in its store window.
A Raspberry PI Zero W is connected to this monitor.
A Chromium browser runs in kiosk mode and displays a web site.
This web site is a React app which periodically requests the nearby pharmacies which are in service from a backend.
The backend is implemented as a serverless function, hosted together with the static assets of the web site on Netlify.
The serverless function accesses the data from a PostgreSQL database hosted in the cloud.

## Installation

### Local installation of the React/TypeScript development environment

`
yarn
`

### Netlify configuration

### PostgreSQL database

- Schema

- content depends on the "Landesapothekerkammer".
  Some provide information in XML format, others only provide web pages or PDF documents.

### Hardware in the Pharmacy

- LCD Monitor

As an LCD monitor we use a Philips 243B9 https://www.philips.de/c-p/243B9_00/lcd-monitor-mit-usb-c-anschluss
which can be rotated by 90° to allow a portrait display of the emergency-service plan
and provides sufficient power to run a Raspberry PI Zero.

- Raspberri PI Zero W

To run a web browser in kiosk mode to display the emergency pharmacy service information,
a Raspberry PI Zero W is sufficient.

- Cables

    - micro USB cable to connect the Raspberry PI (micro-B plug) to the monitor (either USB-C or USB-A) is required.

    - mini HDMI cable to conect the Raspberry PI (mini HDMI plug) to the monitor (HDMB)

- SD card

### Raspberry PI Zero W configuration

- HDMI configuration (sufficient power, rotation)
- autostart Chromium with web page in kiosk mode
- no screen saver
- WLAN setup
