# Smartmap Introduction

Welcome to Smartmap
For the design challenge(proftaak) we(our proftaak group consisting of 6 persons) had a brainstorm session where we had to come up with 150 possible problems that we would like to solve, at the end we had to choose one problem. Our problem was with the public paper maps at bus stops being unclear. They show you all the lines instead of the line you're interested in.

After we described our problem we had to come up with a solution for this problem. Our solution is an interactive public transport map application called smartmap. We want to place touchscreens at every bus stop where you can interact with the map. You can search for a bus line or select pre defined lines, all possible stops and information about each stop such as the timestamps.

This project integrates five different aspects of our study that we've followed in the first 7 weeks. These are:

- ICT & Technology
- ICT & Software Engineering
- ICT & Infrastructure
- ICT & Business
- ICT & Media

## Project Description
Smartmap consists of three individual applications that communicate with each other. 
The first application, our backend, the smart-map API is developed with express.js and is hosted on an nginx web server in the ictdebrouwer domain. Nginx serves as a proxy to redirect node requests back to PM2 (the process manager for node applications) so we can easily maintain the application and get real time information such as the amount of connections.

The second application, our interactive client, the smart map client is developed in javascript and consumes our api and the mapbox api to create directions based upon the data we serve the client. When launched a browser based application will appear on the screen and you will be able to choose between 7 bus lines. For each bus a line is drawn on the screen and each bus stop is marked as well. When a stop is clicked, real time information will be shown. 

The third application, our arduino client, makes http requests to the API to check whether someone has pressed the Stop here button at a bus stop. Whenever someone presses the button, a red LED will light up. 
### How to use the API?
The endpoint url for the api is https://ictdebrouwer.nl when initially visiting the webpage you will find a similar readme file with all the possible endpoints. However, if you would like to contribute to this project or test the api locally you can clone this project and run the following commands to launch the express app locally.

This will install all the necessary dependencies, such as express and the body-parser required to handle post requests.

```
npm install
```
Next up you want to launch the application, running this command will launch a nodemon development server that will restart whenever a new change in code is found.
```
npm start
```
### How to use the client?
To use the client get the latest release from the release section and unpack the zip. Then run the executable.

If you would like to contribute to this project or run the client from source you can clone this project and run the following commands to launch the client.

This will install all the necessary dependencies, such as electron and mapbox.

```
npm install
```
Next up you want to launch the client, running this command will launch the client and will restart it whenever a new change in code is found.
```
npm start
```
### How to use the Arduino project
