# Smartmap

Welcome to Smartmap
For the design challenge(proftaak) we(our proftaak group consisting of 6 persons) had a brainstorm session where we had to come up with 150 possible problems that we would like to solve, at the end we had to choose one problem. Our problem was with the public paper maps at bus stops being unclear. They show you all the lines instead of the line you're interested in.

After we described our problem we had to come up with a solution for this problem. Our solution is an interactive public transport map application called smartmap. We want to place touchscreens at every bus stop where you can interact with the map. You can search for a bus line or select pre defined lines, all possible stops and information about each stop such as the timestamps.

This project integrates five different aspects of our study that we've followed in the first 7 weeks. These are:

- ICT & Technology
- ICT & Software Engineering
- ICT & Infrastructure
- ICT & Business
- ICT & Media

### How to use this Application?

You are currently on the page of the smartmap API. We consume public transport data from the https://github.com/skywave/KV78Turbo-OVAPI/wiki API

if you're interested in contributing to the app, or use it for your own local project first clone the project.
Afterwards you need to install all the necessary dependencies with

```
npm install
```

then you can run the application.

```
npm start
```

This will start a nodemon development server.

If you want to use the api, you can use the following endpoints.

For a further explanation of what each route does and to call the api, please refer to https://ictdebrouwer.nl

```
GET /journey/
GET /journey/eindhoven
GET /actuals/eindhoven/:journeykey
GET /lines
GET /lines/dacs/
GET /route
GET /route/:line
GET /bus/stop
POST /bus

```

### Example API call

```
fetch('https://ictdebrouwer.nl/journey')
 .then(res => res.json())
 .then(res => console.log(res))

// Data
{

    data: {
    0: "CXX_20191104_N009_14_0",
    1: "CXX_20191104_L319_277_0",
    2: "CXX_20191104_M181_636_0",
    3: "CXX_20191104_N073_57_0",
    4: "CXX_20191104_X085_44_0",
    5: "CXX_20191104_M341_102_0",
    6: "CXX_20191104_L406_108_0",
}
```
