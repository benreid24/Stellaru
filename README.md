# Stellaru
Stellaru is a data visualization suite for the game Stellaris. It runs alongside the game and provides realtime snapshots and historical data from the game. The dashboards are viewable as a web page. It works by monitoring and parsing the autosaves while you play, then sending the data to the webpage to keep the charts updated. The historical data is saved in zipped pickle files inside of the folder of the game save that is being monitored, which ensues they get deleted if a game save is deleted. It currently runs on Windows and MacOS with Linux support coming soon. It also works in muliplayer games out of the box.


## Features
Stellaru contains a laundry list of functionaility that aims to make it as useful to as many people as possible. Key features include:
1. Easy to use and cross platform compatible
2. Works with multiplayer out of the box (though port forwarding is required for players over the internet)
3. Charts update in real time as you play. Refresh rate depends on autosave frequency
4. Over thirty differnt charts and visualizations, organized by category
5. The ability for each user to build their own custom dashboard using their favorite charts
6. Each chart is interactive and customizable, data may be hidden or shown in all charts
7. Tooltips hover over all charts when any one is moused over, showing all values at a point in time
8. The date range of shown data may be adjusted in order to zoom in on interesting periods
9. All changes to each chart and the custom dashboard are persisted for each individual user


## Getting Stellaru
Prebuilt binaries for supported platforms are available [here](https://github.com/benreid24/Stellaru/releases) as zipped folders. Download the appropriate zipfile for your computer and extract the *Stellaru* folder where you would like. Inside the folder is a binary executable that can be double clicked to start Stellaru. A web browser will open with the save selection screen.


## Multiplayer
Stellaru works by running a lightweight webserver that only supplies the frontend as content. This makes it inherently compatible with multiplayer as the other players can navigate to it via their web browsers. The main barrier is forwarding the proper port on your router to your local computer. The Help tab inside of Stellaru will contain specifics on what port to forward, which IP to forward to, and the URL for multiplayer players to connect to. How to forward ports varies from router to router. The steps are as follows:
1. Open Stellaru and select a game save and an empire
2. Navigate to the Help tab and scroll to the Multiplayer section
3. Take note of the Port Forwarding Details, specifically your Internal IP address and the Port Number
    - Note: The default port number is **42069** and only changes if something is using that port when Stellaru starts
4. Navigate to your routers administration page and forward the port:
    - The external port can be any number between 8000 and 65535, however **42069** should be used so the link for multiplayer players in Stellaru stays correct
    - The internal port is the port found in step 3
    - The internal IP address is the IP found in step 3. Note that the internal IP may change, especially for computers connected over WiFi. The forwarded port would need to be updated in that case
5. Send the Multiplayer Link from the Help page to your multiplayer friends, who should open it in their web browser of choice


## Available Visualizations
There are many charts available in Stellaru. They are available across a series of categories, and the ability to create a custom dashboard with your favorite charts exists as well. Some charts include the following:

### Overview Tab and Full UI:
![OVerview Tab](docs/screenshots/overview.png?raw=true)

### Economy Tab Showing Tooltips
![Economy Tab](docs/screenshots/economyTooltip.png?raw=true)

### Detailed Income and Spending Comparisons
![Income/Spending Breakdown](docs/screenshots/productionChart.png?raw=true)

### Multilevel Income/Spending Drilldowns by Category
![Income/Spending Drilldown](docs/screenshots/economyDrilldown.png?raw=true)

### Empire Wide Jobs Breakdown
![Jobs Breakdown](docs/screenshots/jobsChart.png?raw=true)

### Interactive Charts Allow Showing/Hiding Data
![Interactive Chart](docs/screenshots/isolatedChart.png?raw=true)


## Running From Source
For those wishing to make changes or avoid prebuilt binaries, Stellaru may be run from source quite easily. The frontend is built using React and the backend is Python, using Daphne and Django. There are two ways to run from source: Run the Node development server and Django development server side by side, or build the frontend and use the Django development server only. The production service entrypoint, [main.py](backend/main.py) may be used as well. All methods require the following one time setup.

### One Time Setup
Frontend dependencies:
```
cd frontend
npm install
```
Backend virtualenv and dependencies:
```
cd backend
virtualenv -p python3 venv

# Windows
source venv/Scripts/activate

# Everything else
source venv/bin/activate

pip install -r requirements.txt
```

### Running Node and Django Dev Servers
This option is good for anyone looking to make changes to the frontend as it allows React's hot reloading to work properly. It is not suitable for multiplayer use.

To start the backend server source your virtualenv from above then:
```
cd backend
python manage.py runserver 0.0.0.0:8000
```
Start the frontend Node server with:
```
cd frontend
npm start
```
Stellaru is now available at [localhost:3000](localhost:3000)

### Running Using the Backend Server Only
This mode more closely resembles how the released version Stellaru runs, and exactly resembles it if [main.py](backend/main.py) is used instead of [manage.py](backend/manage.py) below.

Build the frontend and make it available to the backend server:
```
cd frontend
npm run build
cd ../backend
python manage.py collectstatic
```
The do one of the following to start the backend:
1. Start the Django development server: `python manage.py runserver 0.0.0.0:8000`
2. Start Stellaru using its main entrypoint: `python main.py`
