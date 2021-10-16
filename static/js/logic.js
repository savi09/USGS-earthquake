// Store our API endpoint as queryUrl.

// var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {


  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {


  function getColor(m) {
    if (m < 10) return "lime";
    else if (m >= 10 && m < 30) return "yellow";
    else if (m >= 30 && m < 50)  return "gold";
    else if (m >= 50 && m < 70) return "orange"
    else if (m >= 70 && m < 90) return "orangered";
    else return color = "red";
  }

  function pointToLayer(feature, latlng) {
    // Add circles to the map.
    return new L.circleMarker(latlng, {
      fillOpacity: 0.5,
      stroke: false, 
      fillColor: getColor(feature.geometry.coordinates[2]),
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


   // Set up the legend.
 var legend = L.control({position: 'bottomright'});

 legend.onAdd = function () {

   var div = L.DomUtil.create('div', 'info legend');
   var quakeMag = [-10, 10, 30, 50, 70, 90];
   var colors = ["lime", "yellow", "gold", "orange", "orangered", "red"];
       // labels = [];

   // loop through our density intervals and generate a label with a colored square for each interval
   for (var i = 0; i < quakeMag.length; i++) {
       div.innerHTML +=
           '<i style="background:' + colors[i] + '"></i> ' +
           quakeMag[i] + (quakeMag[i + 1] ? '&ndash;' + quakeMag[i + 1] + '<br>' : '+');
   }

   return div;
 };

 legend.addTo(myMap);

};


