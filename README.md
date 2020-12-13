# Apothekennotdienst

Application to display emergency pharmacy service information.

A pharmacy in Germany is legally required to display at least 2 other nearby pharmacies which are in-service if the pharmacy is closed.

This app displays this information along with the location of the other nearby pharmacies on a map.

![screenshot of emergency pharmacy service information](doc/screenshot.png)

## System setup

The pharmacy uses a cheap LCD monitor in its store window.
A Raspberry PI Zero W is connected to this monitor.
A Chromium browser runs on the Raspberry PI in kiosk mode and displays a web site.
This web site is a React app which periodically requests the nearby pharmacies which are in service from a backend.
The backend is implemented as a serverless function, hosted together with the static assets of the web site on Netlify.
The serverless function accesses the data from a PostgreSQL database hosted in the cloud.

## Installation

### PostgreSQL database

You need a PostgreSQL database in the cloud for storing the data.
[ElephantSQL](https://www.elephantsql.com/) provides a PostgreSQL database "as a service".
The free "Tiny Turtle" version is sufficient for this application.

Create an instance and copy your database URL for later use.

Execute the following SQL queries to create your schema:

```sql
create table if not exists pharmacies (
	"name" text not null,
	phone text,
	street text not null,
	postalcode text not null,
	city text not null,
	loc point,
	primary key(name, city),
	unique (name, city)
);
create index on pharmacies using gist(loc);
create table if not exists services (
	"name" text not null,
	city text not null,
	"start" timestamp with time zone,
	"end" timestamp with time zone,
	foreign key ("name", city) references pharmacies ("name", city),
	unique ("name", city, "start", "end")
);
```

Fill those tables with the appropriate data on the pharmacies (geolocation) and emergency services.

The method how to fill this table depends on the respective "Landesapothekerkammer".
Some provide information in XML format, others only provide web pages or PDF documents.

### Local installation of the React/TypeScript development environment

Set the environment variable POSTGRESQL_URL to the URL (including username and password) of your PostgreSQL database.
This can be provided using a file `.env`.

```sh
yarn
yarn build
yarn start
```

Your local application is then running at http://localhost:3000.
In order to select the correct pharmacy and city, you have to provide these using query parameters:
http://localhost:3000?name=XYZ-Apotheke&city=Musterstadt

### Netlify configuration

- Build & deploy
  - Build settings
    - Repository: github.com/TimGeisler/apothekennotdienst (or your clone)
    - Build command: yarn build
    - Publish directory: build
    - Builds: Active
  - Deploy contexts
    - Production branch: main
    - Deploy only the production branch
  - Environment variables
    - POSTGRESQL_URL: set to the URL of your database

### Hardware in the Pharmacy

The following hardware (with costs of approximately 240 €) is sufficient for the display in the pharmacy.

#### LCD Monitor

As an LCD monitor we use a [Philips 243B9](https://www.amazon.de/gp/product/B0831WZ2S5?ie=UTF8&tag=tge00-21&camp=1638&linkCode=xm2&creativeASIN=B0831WZ2S5)
which can be rotated by 90° to allow a portrait display of the emergency-service plan
and provides sufficient power to run a Raspberry PI Zero.

#### Raspberri PI Zero W

To run a web browser in kiosk mode to display the emergency pharmacy service information,
a [Raspberry PI Zero W (including case)](https://www.amazon.de/gp/product/B072TN5KFN?ie=UTF8&tag=tge00-21&camp=1638&linkCode=xm2&creativeASIN=B072TN5KFN) is sufficient.

#### Cables

  - [Micro USB cable](https://www.amazon.de/gp/product/B07K7M2S9N?ie=UTF8&tag=tge00-21&camp=1638&linkCode=xm2&creativeASIN=B07K7M2S9N) to connect the Raspberry PI (micro-B plug) to the monitor (either USB-C or USB-A) is required.

  - [Mini HDMI cable](https://www.amazon.de/gp/product/B00ADOP14I?ie=UTF8&tag=tge00-21&camp=1638&linkCode=xm2&creativeASIN=B00ADOP14I) to conect the Raspberry PI (mini HDMI plug) to the monitor (HDMB)

#### SD card

  - [16 GB SD Card](https://www.amazon.de/gp/product/B00CBAUIEU?ie=UTF8&tag=tge00-21&camp=1638&linkCode=xm2&creativeASIN=B00CBAUIEU) for the Raspberry PI software

### Raspberry PI Zero W configuration

- Download and install the [Raspberry PI imager](https://www.raspberrypi.org/software/). With the imager, download and copy a suitable Raspberry PI OS image on the SD card.

- HDMI configuration (sufficient power, display rotation)

  in file `/boot/config.txt`:
  ```
  hdmi_save=1
  display_rotate=1
  ```
  More documentation is available from https://www.raspberrypi.org/documentation/configuration/config-txt/video.md

- WLAN setup

  setup WLAN correctly (e.g. https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md)

- autostart Chromium with web page in kiosk mode

  see https://wolfgang-ziegler.com/blog/setting-up-a-raspberrypi-in-kiosk-mode-2020

- use the URL of your Netlify app as URL for the browser and do not forget to provide the query parameters for `name` and `city`
