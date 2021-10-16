// Store our API endpoint as queryUrl.

// var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {



  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {

  function pointToLayer(feature, latlng) {
    var color;
    if (feature.geometry.coordinates[2] < 10) {
      color = "lime";
    }
    else if (feature.geometry.coordinates[2] >= 10 && feature.geometry.coordinates[2] < 30) {
      color = "yellow";
    }
    else if (feature.geometry.coordinates[2] >= 30 && feature.geometry.coordinates[2] < 50)  {
      color = "gold";
    }
    else if (feature.geometry.coordinates[2] >= 50 && feature.geometry.coordinates[2] < 70)  {
      color = "orange";
    }
    else if (feature.geometry.coordinates[2] >= 70 && feature.geometry.coordinates[2] < 90)  {
      color = "orangered";
    }
    else {
      color = "red";
    }

    // Add circles to the map.
    return new L.circleMarker(latlng, {
      fillOpacity: 0.5,
      stroke: false, 
      fillColor: color,
      // Adjust the radius.
      radius: feature.properties.mag * 1.5
    })

    

  }



    
    // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {

    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: pointToLayer,
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
  }



function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      0, 30
    ],
    zoom: 2.5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


}


//////////////////////////////////////////////////////////////

function getColor(m) {
  return m >= 90  ? "red" :
        m >= 70  ? "orangered" :
        m >= 50  ? "orange" :
        m >= 30   ? "gold":
        m >= 10   ? "yellow" :
                      "lime";
}

  // Set up the legend.
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var quakeMag = [10, 30, 50, 70, 90];
    var labels = [];

    // Add the minimum and maximum.
    var legendInfo = "<h1>Median Income</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + quakeMag[0] + "</div>" +
        "<div class=\"max\">" + quakeMag[quakeMag.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    quakeMag.forEach(function(quakeMag, index) {
      labels.push("<li style=\"background-color: " + getColor[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);

//////////////////////////////////////////////////////////////