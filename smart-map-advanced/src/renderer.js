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

//Stores currently loaded markers
var markers = [];

//Map loaded
map.on("load", function () {

});

function DisableElement(elementName){
    var el = document.getElementsByClassName(elementName)[0];
    el.style.display = "none";
}

function EnableElement(elementName){
    var el = document.getElementsByClassName(elementName)[0];
    el.style.display = "block";
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
    map.removeLayer("route");
    map.removeSource("route");
    markers.forEach(marker => {
        marker.remove();
    })

    markers = [];

    DisableElement('topbar');
    EnableElement('selection');
}

//Move to the location of the clicked marker
function MarkerClicked(point) {
    map.flyTo({ center: point, zoom: 15 })
}

function RequestLinePositions(lijnNr){
    var request = new XMLHttpRequest();

    request.open('GET', 'http://localhost:3000/route/' + lijnNr, true);

    request.onload = function () {
        var route = JSON.parse(request.response);
        AddBusLine(route.myData, '#5b85aa', 8);
    }

    request.send();
}

function RequestStopPositions(lijnNr){
    var request = new XMLHttpRequest();

    request.open('GET', 'http://localhost:3000/actuals/eindhoven/' + lijnNr, true);

    request.onload = function () {
        var lines = JSON.parse(request.response);
        var allStops = [];
        Object.values(lines.actualsData).forEach(function (key) {
                var stops = Object.values(key.Stops);
                if (stops.length > allStops.length) {
                    allStops = stops;
                }
        });

        AddStopMarkers(allStops);
    }

    request.send();
}

//Create a marker for every position in points
function AddStopMarkers(points) {
    points.forEach(point => {
        var latLong = [point.Longitude, point.Latitude]
        var el = document.createElement('div');
        el.className = 'marker';
        el.style.cursor = 'pointer';
        el.addEventListener("click", function () { MarkerClicked(point) });

        var mark = new mapboxgl.Marker(el, {
            offset: [0, -19]
        })
            .setLngLat(latLong)
            .addTo(map);

        markers.push(mark);
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
    map.fitBounds(bounds, { padding: 80 })
}