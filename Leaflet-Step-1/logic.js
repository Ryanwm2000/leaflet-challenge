// Get data url
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Get marker color based on earthquake magnitude
function getColor(mag) {
    if (mag >= 5) {
        return "#ff6633" } 
        else { if (mag > 4) {
        return "#ff9933"} 
        else { if (mag > 3) {
        return "#ffcc33" } 
        else { if (mag > 2) {
        return "#ffff33"} 
        else { if (mag > 1) {
        return "#ccff33"} 
        else { return "#ff3333" } } } } }
};

// function to create map features
function createFeatures(earthquakeData) {
    // Create popup layers 
    function onEachFeature(feature, layer) {
        layer.bindPopup("<p>" + feature.properties.title + "</p>" +
            "<p>Earthquake Type: " + feature.properties.type + "</p>" +
            "<p>Magnitude of Earthquake: " + feature.properties.mag + "</p>");
    }
    //circle markers
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {
                radius: feature.properties.mag * 3,
                fillOpacity: 1,
                color: getColor(feature.properties.mag)
            })
        },
        // Append popups 
        onEachFeature: onEachFeature
    });
    createMap(earthquakes);
};

//create tile layer on the map
function createMap(earthquakes) {
    
    var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });
    var myMap = L.map("map", {
        center: [29.876019, -107.224121],
        zoom: 4.5,
        layers: [mapLayer, earthquakes]
    });
    // legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var colors = [
            "#ff3333", "#ccff33", "#ffff33", "#ffcc33", "#ff9933", "#ff6633"];
        var labels = [];

        var legendInfo = "<h1>Intensity<h1>" + 
            "<div class=\"labels\">" +
                "<div class=\"max\">5+</div>" +
                "<div class=\"fourth\">4-5</div>" +
                "<div class=\"third\">3-4</div>" +
                "<div class=\"second\">2-3</div>" +
                "<div class=\"first\">1-2</div>" +
                "<div class=\"min\">0-1</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        colors.forEach(function(color) {
            labels.push("<li style=\"background-color: " + color + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    // Append label to the map
    legend.addTo(myMap);

};

// Get earthquakes data
d3.json(url, function(data) {
    // Create features with the earthquakes data
    createFeatures(data.features)
});