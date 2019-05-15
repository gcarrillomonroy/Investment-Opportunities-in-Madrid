  var myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3
  });

  var l_longitude = '';
  var l_latitude = '';

function scattergeomarkers(myDiv, latitude, longitude) {
    // By default, geographic data is loaded asynchronously from
    // the topojson subdirectory located at the root of the plotlyjs directory.
    //
    // To remove this asynchronous step, include:
    // 
    // after 'plotly.min.js'.
    // Note that this bundle is quite large.
    // Serving it from a network is not recommended.
    //
    // If you choose to rename or move the topojson subdirectory, include
    // 
    // after 'plotly.min.js'

console.log("Lat: " + latitude + " - Long: " + longitude);

var data = [{
  type:'scattermapbox',
  lat: latitude,
  lon: longitude,
  mode:'markers',
  marker: {
    size:14
  },
  text:['Madrid']
}]

var layout = {
  autosize: true,
  hovermode:'closest',
  mapbox: {
    bearing:0,
    center: {
      lat:latitude,
      lon:longitude
    },
    pitch:0,
    zoom:15
  },
}

Plotly.setPlotConfig({
  mapboxAccessToken: 'pk.eyJ1Ijoiam9uYXRoYW5yZWIiLCJhIjoiY2p0Z2k0a3hiMDRkODRhcDJ3aGY3cXJjcyJ9.lwMAckeCZye5Et7-hegMWQ'
})

    Plotly.newPlot(myDiv, data, layout);
}


function buildCharts(category, zone) {
  console.log("buildCharts function:" + category + "=" +zone);

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  
  var queryUrl = '';
  var cat_zone = ''; 
  
  if(category == 'All' || zone == 'All'){
    console.log("Entro a All");
    if(category == 'All' && zone != 'All'){
      console.log("Solo Category");
    }else if(category != 'All' && zone == 'All'){
      console.log("Solo Zone");
    }else{
      console.log("Ambos");
    }
  }else if(category != 'All' && zone != 'All'){
    console.log("Ninguno es All");        
  }

  if(zone == 'All'){
    l_boxmode = ''
    l_dtick = 50
  }
  else{
    l_boxmode = 'group'
    l_dtick = 15
  }

  cat_zone = category + "+" + zone;
  queryUrl = "http://127.0.0.1:5000/api/v1.0/cz/" + cat_zone;

  //var queryUrl = "http://127.0.0.1:5000/api/v1.0/cz/" + cat_zone;

  //console.log("URL");
  d3.json(queryUrl).then(function(JsonData) {
    //if (err) throw err;

    days = []
    l_categories = [];

    //category = []
    Avg_per_day = [];
    Max_amount_by_day = [];
    Min_amount_by_day = [];
    valmax = [];
    valmin = [];

  // parse data
    JsonData.forEach(function(data) {

    //console.log("JsonData" + data);

    data.Avg_amount_by_day = +data.Avg_amount_by_day;
    //data.Latitude = +data.Latitude;
    //data.Longitude = +data.Longitude;
    data.Max_amount_by_day = +data.Max_amount_by_day;
    data.Min_amount_by_day = +data.Min_amount_by_day;
    data.valmax = +data.valmax;
    data.valmin = +data.valmin;

    days.push(data.Day);
    //if(category != 'All'){
    l_categories.push(data.Category);
    //}
    Avg_per_day.push(data.Avg_amount_by_day);
    Max_amount_by_day.push(data.Max_amount_by_day);
    Min_amount_by_day.push(data.Min_amount_by_day);
    valmax.push(data.valmax);
    valmin.push(data.valmin);

    l_longitude = data.Longitude;
    l_latitude = data.Latitude;
    //console.log(data.Day);
    console.log("2Lat: " + l_latitude + " - 2Long: " + l_longitude);

  });

  if(category == 'All'){
    //l_categories = ['All','All','All','All','All','All','All'];
  }

  console.log("1:" + days);

  var xData = days;

  var yData = Avg_per_day;
  var colors = ['rgba(93, 164, 214, 0.5)', 'rgba(255, 144, 14, 0.5)', 'rgba(44, 160, 101, 0.5)', 'rgba(255, 65, 54, 0.5)', 'rgba(207, 114, 255, 0.5)', 'rgba(127, 96, 0, 0.5)', 'rgba(255, 140, 184, 0.5)', 'rgba(79, 90, 117, 0.5)', 'rgba(222, 223, 0, 0.5)'];

  var data = [];
console.log("2.Lat: " + l_latitude + " - 2.Long: " + l_longitude);
console.log(Min_amount_by_day[0] + " " + valmax[0] + valmin[0]);
  for ( var i = 0; i < xData.length; i ++ ) {
      yData=[]
      //yData.push(Min_amount_by_day[i],Min_amount_by_day[i],Avg_per_day[i],Avg_per_day[i],Max_amount_by_day[i],Max_amount_by_day[i])
      yData.push(Min_amount_by_day[i],Avg_per_day[i],Max_amount_by_day[i], valmax[i], valmin[i], valmin[i])

      //console.log(Avg_per_day);
      var result = {
          type: 'box',
          y: yData,
          name: xData[i] + ' - ' + l_categories[i],
          //boxpoints: 'all',
          jitter: 0.5,
          whiskerwidth: 0.2,
          fillcolor: 'cls',
          //legendgroup: ['aa', 'bb', 'cc', 'dd', 'ee'],
          //width: 0.5,
          marker: {
              size: 2
          },
          line: {
              width: 1
          }
      };
      data.push(result);
  };

  layout = {
      title: "Category:" + category + "<br>Neigborhood: " + zone,
      yaxis: {
          autorange: true,
          showgrid: true,
          zeroline: true,
          dtick: l_dtick,
          gridcolor: 'rgb(255, 255, 255)',
          gridwidth: 1,
          zerolinecolor: 'rgb(255, 255, 255)',
          zerolinewidth: 2
      },
      margin: {
          l: 40,
          r: 30,
          b: 80,
          t: 100
      },
      xaxis: {
          autorange: true,
      },
      paper_bgcolor: 'rgb(243, 243, 243)',
      plot_bgcolor: 'rgb(243, 243, 243)',
      showlegend: true,
      boxmode: l_boxmode
  };

  //createMap();
  console.log("GRAFICA:" + data);
  Plotly.newPlot('chart', data, layout);
console.log("2-Lat: " + l_latitude + " - 2-Long: " + l_longitude);

  console.log("3Lat: " + l_latitude + " - 3Long: " + l_longitude);
  scattergeomarkers('map', l_latitude, l_longitude);

  });



}

function init() {
  //console.log("Starting Init function");

  var firstCategory = '';
  var firstZone = '';

  // Grab a reference to the dropdown select element
  var selector = d3.select("#selCat");

  // Use the list of sample names to populate the select options
  d3.json("http://127.0.0.1:5000/api/v1.0/categories").then((Categories) => {
    Categories.forEach((category) => {
      selector
        .append("option")
        .text(category.Category)
        .property("value", category.Category);

        //console.log(category)
    });
 
    // Use the first sample from the list to build the initial plots
    firstCategory = Categories[0];
    //buildCharts(firstCategory);
    //buildMetadata(firstCategory);
  });


  var selector_z = d3.select("#selZone");
  //console.log("zones");
  // Use the list of sample names to populate the select options
  d3.json("http://127.0.0.1:5000/api/v1.0/zones").then((Zones) => {
    Zones.forEach((zone) => {
      selector_z
        .append("option")
        .text(zone.neigborhood)
        .property("value", zone.neigborhood);

        //console.log(category)
    });  
    firstZone = Zones[0];
  }); 

  buildCharts("All", "All");
    //buildMetadata(firstCategory);  

}

function categoryChanged(newCategory, newZone) {
  // Fetch new data each time a new sample is selected
  //console.log("New Cat/zone:" + newCategory + "-" + newZone);
  buildCharts(newCategory, newZone);
  //buildMetadata(newSample);
}

function zoneChanged(newCategory, newZone) {
  // Fetch new data each time a new sample is selected
  //console.log("New Zone:" + newZone);
  buildCharts(newCategory, newZone);
  //buildMetadata(newSample);
}

// Initialize the dashboard
console.log("Calling Init function");
init();
