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
function DeleteElement(elementName) {
    Array.from(document.getElementsByClassName(elementName)).forEach(function (element) {
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
    var latLong = point.location;

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
    title.appendChild(document.createTextNode(point.name));

    var ends = point.lineName.split(' - ');

    var fromTitle = document.createElement('h2');
    fromTitle.appendChild(document.createTextNode('Richting ' + ends[0]));

    var from = document.createElement('h3');
    from.appendChild(document.createTextNode(new Date(point.fromTime).toLocaleTimeString()));

    var toTitle = document.createElement('h2');
    toTitle.appendChild(document.createTextNode('Richting ' + ends[ends.length - 1]));

    var to = document.createElement('h3');
    to.appendChild(document.createTextNode(new Date(point.toTime).toLocaleTimeString()));

    el.appendChild(title);
    el.appendChild(fromTitle);
    el.appendChild(from);
    el.appendChild(toTitle);
    el.appendChild(to);

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
        Object.values(lines.actualsData).forEach(function (line) {
            var stops = Object.values(line.Stops);

            var fromStation = stops.filter((stop) => stop.LineDirection === 1);
            var toStation = stops.filter((stop) => stop.LineDirection === 2);

            console.log(fromStation);

            fromStation.forEach(stop => {
                if (Date.parse(stop.ExpectedArrivalTime) < Date.now()) return;

                var currentStop;

                allStops.forEach(oldStop => {
                    if (oldStop.name == stop.TimingPointName) {
                        currentStop = oldStop;
                        return;
                    }
                });

                if (currentStop != undefined) {
                    console.log(Date.parse(stop.ExpectedArrivalTime) < Date.parse(currentStop.fromTime))
                    if (Date.parse(stop.ExpectedArrivalTime) < Date.parse(currentStop.fromTime)) {
                        currentStop.fromTime = stop.ExpectedArrivalTime;
                    }
                }
                else {
                    if (Date.parse(stop.ExpectedArrivalTime) > Date.now()) {
                        allStops.push({
                            lineName: stop.LineName,
                            name: stop.TimingPointName,
                            line: stop.LinePublicNumber,
                            location: [stop.Longitude, stop.Latitude],
                            fromTime: stop.ExpectedArrivalTime,
                            toTime: null
                        });
                    }
                }
            });

            toStation.forEach(stop => {
                if (Date.parse(stop.ExpectedArrivalTime) < Date.now()) return;

                var currentStop;

                allStops.forEach(oldStop => {
                    if (oldStop.name == stop.TimingPointName) {
                        currentStop = oldStop;
                        return;
                    }
                });

                if (currentStop != undefined) {
                    if (currentStop.toTime == null || Date.parse(stop.ExpectedArrivalTime) < Date.parse(currentStop.toTime)) {
                        currentStop.toTime = stop.ExpectedArrivalTime;
                    }
                }
                else {
                    if (Date.parse(stop.ExpectedArrivalTime) > Date.now()) {
                        allStops.push({
                            lineName: stop.LineName,
                            name: stop.TimingPointName,
                            line: stop.LinePublicNumber,
                            location: [stop.Longitude, stop.Latitude],
                            fromTime: null,
                            toTime: stop.ExpectedArrivalTime
                        });
                    }
                }
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
        var latLong = point.location;

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