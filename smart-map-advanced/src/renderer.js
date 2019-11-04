var mapboxgl = require('mapbox-gl');

//Personal access token for mapbox
mapboxgl.accessToken =
    "pk.eyJ1IjoicmVuc2IiLCJhIjoiY2o3bm52anZoMnlxNTJycXBuNmF5eXBjeSJ9.w24bQq3Zm3deNY68pPPBwg";

//Create new map object
var map = new mapboxgl.Map({
    container: "container",
    style: "mapbox://styles/rensb/ck2epx98z2ghr1dqk33snnl1d",
    zoom: 12,
    center: [5.478914, 51.4438373]

});

//Disable an element by class name
function DisableElement(elementName) {
    var el = document.getElementsByClassName(elementName)[0];
    el.style.display = "none";
}

//Enable an element by class name
function EnableElement(elementName) {
    var el = document.getElementsByClassName(elementName)[0];
    el.style.display = "block";
}

//Delete all elements by class name
function DeleteElement(elementName){
    Array.from(document.getElementsByClassName(elementName)).forEach(function(element) {
        element.remove();
    });
}

//Add line and markers to map
function AddLine(lijnNr) {
    EnableElement('topbar');
    DisableElement('selection');
    RequestStopPositions(lijnNr);
    RequestLinePositions('L' + lijnNr);
}

//Remove line and markers from map
function ClearMap() {

    //Clear any lines that are drawn on the map
    if (map.getLayer("route") != undefined) {
        map.removeLayer("route");
    }
    if (map.getSource("route") != undefined) {
        map.removeSource("route");
    }

    //Delete any markers and info boxes
    DeleteElement('marker');
    DeleteElement('infobox');

    //Disable the top controls and enable the line selection menu
    DisableElement('topbar');
    EnableElement('selection');
}

//Move to the location of the clicked marker
function MarkerClicked(point) {
    var latLong = [point.Longitude, point.Latitude];
    console.log(point);

    //Move camera so its centered on the clicked marker
    map.flyTo({
        center: latLong,
        zoom: 15
    });

    //Delete any previous opened info boxes
    DeleteElement('infobox');

    //Create new info box
    var el = document.createElement('div');
    el.className = 'infobox';
    el.style.cursor = 'pointer';

    var title = document.createElement('h1');
    title.appendChild(document.createTextNode(point.TimingPointName));

    el.appendChild(title);

    new mapboxgl.Marker(el, {
            offset: [0, -80]
        })
        .setLngLat(latLong)
        .addTo(map);
}

//Get an array of positions from the server used to draw route lines on the map
function RequestLinePositions(lijnNr) {
    //Create a request
    var request = new XMLHttpRequest();
    request.open('GET', ' http://ictdebrouwer.nl/route/' + lijnNr, true);

    //Set the callback that happens when the request is finished
    request.onload = function () {

        //Parse the received JSON data to an object and draw the line
        var route = JSON.parse(request.response);

        AddBusLine(route.myData, '#039BE5', 8);
    }

    //Send the HTTP request to the server
    request.send();
}

//Get object containing all currently active busses from a line used to draw stops and show bus data
function RequestStopPositions(lijnNr) {

    //Create a request
    var request = new XMLHttpRequest();
    request.open('GET', ' http://ictdebrouwer.nl/actuals/eindhoven/' + lijnNr, true);

    //Set the callback that happens when the request is finished
    request.onload = function () {

        //Parse the received JSON data to an object
        var lines = JSON.parse(request.response);

        //Get the object with the most bus stops attached to draw the stops on the map
        var allStops = [];
        Object.values(lines.actualsData).forEach(function (key) {
            var stops = Object.values(key.Stops);
            var fromStation = stops.filter((stop) => stop.LineDirection === 1);
            var toStation = stops.filter((stop) => stop.LineDirection === 2)

            fromStation.forEach(stop => {
                var currentStop = allStops.some(e => e.TimingPointName == stop.TimingPointName);
                console.log(currentStop)
                if(currentStop != undefined){
                    if(Date.parse(stop.ExpectedArrivalTime) <  Date.parse(currentStop.ExpectedArrivalTime)){
                        
                    }                 
                }
                else{
                    console.log(Date.parse(stop.ExpectedArrivalTime) > Date.now())
                    if(Date.parse(stop.ExpectedArrivalTime) > Date.now()){
                        allStops.push({
                        name: stop.TimingPointName,
                        line: stop.LinePublicNumber,
                        location: [stop.Longitude, stop.Latitude],
                        fromTime: stop.ExpectedArrivalTime
                    });
                    }
                }
            });

            toStation.forEach(e => {

            });
        });
        console.log(allStops);
        AddStopMarkers(allStops);
    }

    //Send the HTTP request to the server
    request.send();
}

//Create a marker for every position in points
function AddStopMarkers(points) {

    //Loop through every point and create a marker at the position
    points.forEach(point => {
        var latLong = [point.Longitude, point.Latitude];

        var el = document.createElement('div');
        el.className = 'marker';
        el.style.cursor = 'pointer';

        //Add a callback for when a marker is clicked
        el.addEventListener("click", function () {
            MarkerClicked(point);
        });

        new mapboxgl.Marker(el, {
            offset: [0, -19]
        })
        .setLngLat(latLong)
        .addTo(map);
    });
}

//Add line to map following the positions in points
function AddBusLine(points, color, width) {
    map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": points
                }
            }
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": color,
            "line-width": width
        }
    });

    //Get the bounds of the line
    var bounds = points.reduce(function (bounds, coord) {
        return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(points[0], points[0]));

    //Move the camera so the line fits on screen
    map.fitBounds(bounds, {
        padding: 80
    });
}

if(document.getElementsById('button').disabled){
    document.getElementById('buslijn').style.marginTop = "5%";
} else {
    document.getElementById('buslijn').style.marginTop = "";
}
