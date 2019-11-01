var mapboxgl = require('mapbox-gl');

//Personal access token for mapbox
mapboxgl.accessToken =
    "pk.eyJ1IjoicmVuc2IiLCJhIjoiY2o3bm52anZoMnlxNTJycXBuNmF5eXBjeSJ9.w24bQq3Zm3deNY68pPPBwg";

//Create new map object
var map = new mapboxgl.Map({
    container: "container",
    style: "mapbox://styles/mapbox/streets-v11",
    zoom: 12,
    center: [5.478914, 51.4438373]

});

//Stores currently loaded markers
var markers = [];

//TODO: remove hardcoded path and load paths from server
const viernulzeven = [[5.4785354, 51.4438474],
[5.4787178, 51.4436],
[5.4793722, 51.4436802],
[5.4790504, 51.4441952],
[5.4769797, 51.4438942],
[5.4768207, 51.4438557],
[5.4745837, 51.4434011],
[5.4758336, 51.441221],
[5.4747661, 51.4390509],
[5.474707, 51.4387165],
[5.4749699, 51.4383955],
[5.4760187, 51.437929],
[5.4771171, 51.4372878],
[5.4780759, 51.4365529],
[5.4793634, 51.4355631],
[5.480211, 51.43463],
[5.4838293, 51.4322121],
[5.4848298, 51.4324027],
[5.4849083, 51.4323525],
[5.4855279, 51.4311778],
[5.4860885, 51.4299495],
[5.4868395, 51.4285172],
[5.4869012, 51.4282492],
[5.4868234, 51.4278642],
[5.4856084, 51.4239674],
[5.4847379, 51.4210595],
[5.4834707, 51.4166463],
[5.4817809, 51.4167701],
[5.477197, 51.4172769],
[5.4763354, 51.4173527],
[5.4754844, 51.4173748],
[5.4737175, 51.4172122],
[5.470454, 51.4168353],
[5.4695735, 51.4168341],
[5.4675773, 51.4169466],
[5.4662811, 51.4170834],
[5.4653497, 51.4172502],
[5.4647113, 51.4159734],
[5.4643223, 51.4147501],
[5.4638476, 51.4129426],
[5.463738, 51.4129397],
[5.4636255, 51.4129148],
[5.4635399, 51.4128732],
[5.4634651, 51.412795],
[5.4634091, 51.4126933],
[5.463279, 51.4121212], [5.463257, 51.4120709],
[5.4632309, 51.4119458],
[5.4632342, 51.4117948],
[5.4632744, 51.4117082],
[5.4634058, 51.4115639],
[5.4627648, 51.4090874],
[5.4622391, 51.4068384],
[5.4617925, 51.4068535],
[5.461692, 51.4068368],
[5.4612293, 51.4064729],
[5.4611512, 51.4064321],
[5.461073, 51.406408],
[5.4609839, 51.4063917],
[5.4523458, 51.4061742],
[5.4522556, 51.4061796],
[5.4521708, 51.4061934],
[5.4521087, 51.4062315],
[5.4520737, 51.4062739],
[5.4520494, 51.406349],
[5.4519086, 51.4088377],
[5.4518388, 51.4091188],
[5.4502832, 51.4126112],
[5.4502637, 51.4126911],
[5.4502813, 51.4127468],
[5.450323, 51.4127841],
[5.450377, 51.4128136],
[5.4590204, 51.4143117],
[5.4626213, 51.4149373],
[5.4627219, 51.4149482],
[5.4628225, 51.414944],
[5.4633549, 51.4148813],
[5.4643178, 51.4147583],
[5.4645122, 51.4147967],
[5.4646235, 51.4151246]]

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
    DisableElement('selection')
    AddBusLine(viernulzeven, '#5b85aa', 8)
    RequestStopPositions(lijnNr);
}

//Remove line and markers from map
function RemoveLine() {
    map.removeLayer("route");
    map.removeSource("route");
    markers.forEach(marker => {
        marker.remove();
    })

    markers = [];
}

//Move to the location of the clicked marker
function MarkerClicked(point) {
    map.flyTo({ center: point, zoom: 15 })
}

function RequestLinePositions(lijnNr){
    var request = new XMLHttpRequest();

    request.open('GET', 'http://localhost:3000/route/' + lijnNr, true);

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
        console.log(latLong);
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