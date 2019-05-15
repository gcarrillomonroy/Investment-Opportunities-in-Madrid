function createMap(){

  // Create a map object
  //var myMap = L.map("map", {
  //  center: [15.5994, -28.6731],
  //  zoom: 3
  //});

  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoiam9uYXRoYW5yZWIiLCJhIjoiY2p0Z2k0a3hiMDRkODRhcDJ3aGY3cXJjcyJ9.lwMAckeCZye5Et7-hegMWQ").addTo(myMap);

  // Country data
  var countries = [
    {
      name: "Brazil",
      location: [-14.2350, -51.9253],
      points: 227
    },
    {
      name: "Germany",
      location: [51.1657, 10.4515],
      points: 218
    },
    {
      name: "Italy",
      location: [41.8719, 12.5675],
      points: 156
    },
    {
      name: "Argentina",
      location: [-38.4161, -63.6167],
      points: 140
    },
    {
      name: "Spain",
      location: [40.4637, -3.7492],
      points: 99
    },
    {
      name: "England",
      location: [52.355, 1.1743],
      points: 98
    },
    {
      name: "France",
      location: [46.2276, 2.2137],
      points: 96
    },
    {
      name: "Netherlands",
      location: [52.1326, 5.2913],
      points: 93
    },
    {
      name: "Uruguay",
      location: [-32.4228, -55.7658],
      points: 72
    },
    {
      name: "Sweden",
      location: [60.1282, 18.6435],
      points: 61
    }
  ];


  // Loop through the countries array
  var vcolor = "red";
  for(i = 0; i < countries.length; i++){

    if (countries[i]. points <= 90){
      vcolor = 'red'
    }

    if (countries[i]. points > 90){
      vcolor = 'green'
    }

    if (countries[i]. points > 100){
      vcolor = 'blue'
    }  

    if (countries[i]. points > 200){
      vcolor = 'yellow'
    }


    var circle = L.circle([countries[i].location[0], countries[i].location[1]], {
    color: vcolor,
    fillColor: vcolor,
    fillOpacity: 0.75,
    radius: countries[i].points * 700
    }).addTo(myMap);

    circle.bindPopup(countries[i].name + '<hr>' + countries[i].points);

  }

  Plotly.newPlot('map', '');

    // Conditionals for countries points

    // Add circles to map


    // Adjust radius
}