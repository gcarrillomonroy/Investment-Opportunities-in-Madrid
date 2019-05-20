var myMap = L.map("map", {
  center: [15.5994, -28.6731],
  zoom: 3
});

var l_longitude = '';
var l_latitude = '';

function get_reviews(category, zone){
  //console.log("get_reviews function:" + category + "=" +zone);

  var queryUrl = '';
  var cat_zone = '';   
  var reviews = 0;
  var avg_rating = 0.0;
  var avg_price  = 0.0;

  cat_zone = category + "+" + zone;
  queryUrl = "http://127.0.0.1:5000/api/v1.0/rv/" + cat_zone;

  d3.json(queryUrl).then(function(JsonData) {
    //if (err) throw err;

  // parse data
    JsonData.forEach(function(data) {

    data.Avg_price  += data.Avg_price;
    data.Avg_rating += data.Avg_rating;
    data.Reviews    += data.Reviews;

    avg_price  = data.Avg_price;
    avg_rating = data.Avg_rating;
    reviews    = data.Reviews;
    //console.log("reviews1: ", reviews);
    //console.log("avg_rating1: " + avg_rating);

    buildGauge(parseFloat(avg_rating),'gauger', category, zone, reviews);
    buildGauge(parseFloat(avg_price), 'gaugep', category, zone, reviews);


  });

  //console.log("reviews2: ", reviews);
  //console.log("avg_rating2: " + avg_rating);

  });

  //console.log("reviews: ", reviews);
  //console.log("avg_rating: " + avg_rating);

}

function get_reviews_text(category, zone){
  console.log("get_reviews function:" + category + "=" +zone);

  var queryUrl = '';
  var cat_zone = '';   
  var reviews = [];
  var stars = [];
  var name = [];

  cat_zone = category + "+" + zone;
  queryUrl = "http://127.0.0.1:5000/api/v1.0/rvt/" + cat_zone;

  d3.json(queryUrl).then(function(JsonData) {
    //if (err) throw err;

  // parse data
    JsonData.forEach(function(data) {

      reviews.push(data.Review);
      stars.push(data.Stars);
      name.push(data.Name);

    //buildGauge(parseFloat(avg_rating),'gauger', category, zone, reviews);
    //buildGauge(parseFloat(avg_price), 'gaugep', category, zone, reviews);

    //console.log('Text3: ', reviews);
  });

  //console.log("reviews2: ", reviews);
  //console.log("avg_rating2: " + avg_rating);
  console.log('Text2: ', reviews);

  var values = [
    name, stars, reviews
]

var data = [{
type: 'table',
header: {
  values: [["<b>Commerce Name</b>"],["<b>Price Level</b>"],["<b>Reviews</b>"]],
  align: "center",
  line: {width: 1, color: 'black'},
  fill: {color:['rgb(235, 100, 230)']},
  font: {family: "Arial Narrow", size: 12, color: "white"}
},
cells: {
  values: values,
  align: "center",
  line: {color: "black", width: 1},
  font: {family: "Arial", size: 11, color: ["black"]}
}
}]

Plotly.plot('review_text', data);


  });

  //console.log("reviews: ", reviews);
  //console.log("avg_rating: " + avg_rating);  
}


function buildGauge(value, chart, category, zone, reviews){
  // Enter a speed between 0 and 180
  var level = value;
  var chart = chart;

  if( chart == 'gauger'){
    a_text = [' ', ' ', ' ', ' ', ' ', ' '];
    a_colors = ['rgba(0, 230, 0,.9)',
    'rgba(0, 230, 0, .9)', 'rgba(230, 230, 0, .9)',
    'rgba(241, 44, 13, .9)', 'rgba(241, 44, 13, .9)',
    'rgba(255, 255, 255, 0)'];
    a_name = 'Reviews Rating. Analyzed: ' + reviews; 
  }else{
    a_text = ['$$$$$', '$$$$', '$$$', '$$', '$', ' '];
    a_colors = ['rgba(241, 44, 13, .9)', 'rgba(240, 205, 13, .9)'
    , 'rgba(230, 230, 0, .9)',
    'rgba(160, 230, 0, .9)', 'rgba(0, 230, 0,.9)',
    'rgba(255, 255, 255, 0)'];  
    a_name = 'Price Level. Analyzed: ' + reviews; 
  }

  // Trig to calc meter point
  var degrees = 216 - ((level*180)/5),
       radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: a_name,
      text: level,
      hoverinfo: 'text+name'},
    { values: [50/5, 50/5, 50/5, 50/5, 50/5, 50],
    rotation: 90,
    text: a_text,    
    textinfo: 'text',
    textposition:'inside',
    colorscale: 'Jet',
    marker: {colors: a_colors},
    labels: ['5', '4', '3', '2', '1', ' '],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    //font: {family: "Arial"},
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: a_name,
    //height: 1000,
    //width: 1000,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot(chart, data, layout);
  
}


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
  size:1400
},
text: latitude//['Madrid']
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
mapboxAccessToken: 'pk.eyJ1Ijoiam9uYXRoYW5yZWIiLCJhIjoiY2p0Z2k0a3hiMDRkODRhcDJ3aGY3cXJjcyJ9.lwMAckeCZye5Et7-RegMWJ'
})

  Plotly.newPlot(myDiv, data, layout);
}


function buildCharts(category, zone) {
console.log("buildCharts function:" + category + "=" +zone);

// @TODO: Use `d3.json` to fetch the sample data for the plots

var queryUrl = '';
var cat_zone = ''; 

if(category == 'All' || zone == 'All'){
  //console.log("Entro a All");
  if(category == 'All' && zone != 'All'){
    //console.log("Solo Category");
  }else if(category != 'All' && zone == 'All'){
    //console.log("Solo Zone");
  }else{
    //console.log("Ambos");
  }
}else if(category != 'All' && zone != 'All'){
  //console.log("Ninguno es All");        
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

//console.log("queryUrl->", queryUrl);
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
  //console.log("2Lat: " + l_latitude + " - 2Long: " + l_longitude);

});

if(category == 'All'){
  //l_categories = ['All','All','All','All','All','All','All'];
}

//console.log("1:" + days);

var xData = days;

var yData = Avg_per_day;
var colors = ['rgba(93, 164, 214, 0.5)', 'rgba(255, 144, 14, 0.5)', 'rgba(44, 160, 101, 0.5)', 'rgba(255, 65, 54, 0.5)', 'rgba(207, 114, 255, 0.5)', 'rgba(127, 96, 0, 0.5)', 'rgba(255, 140, 184, 0.5)', 'rgba(79, 90, 117, 0.5)', 'rgba(222, 223, 0, 0.5)'];

var data = [];
//console.log("2.Lat: " + l_latitude + " - 2.Long: " + l_longitude);
//console.log(Min_amount_by_day[0] + " " + valmax[0] + valmin[0]);
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

t_category = '';
console.log('Category >>' + category)
switch (category){
  case 'es_restaurant':
    t_category = 'Restaurants'
    break;
  case 'es_cafe':
    t_category = 'Bars and cafes'
    break;
  case 'es_fastfood':
    t_category = 'Fast food restaurants'
    break;
  case 'es_pub':
    t_category = 'Pubs and night clubs'
    break;       
  case 'All':
    t_category = 'All'
    break;          
}

layout = {
    title: "Category:" + t_category + "<br>Neigborhood: " + zone,
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
//console.log("GRAFICA:" + data);
Plotly.newPlot('chart', data, layout);
//console.log("2-Lat: " + l_latitude + " - 2-Long: " + l_longitude);

//console.log("3Lat: " + l_latitude + " - 3Long: " + l_longitude);
//AQUI VA EL MAPA, DESCOMENTAR PARA QUE SE GRAFIQUE 
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
    cat_text = '';
    switch (category.Category){
      case 'es_fastfood':
        cat_text = 'Fast food restaurants'
        break;
      case 'es_restaurant':
        cat_text = 'Restaurants'
        break;
      case 'es_pub':
        cat_text = 'Pubs and night clubs'
        break;
      case 'es_cafe':
          cat_text = 'Bars and cafes'
          break;        
      default:
        cat_text = 'All'
        break;
    }

    selector
      .append("option")
      .text(cat_text)
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
get_reviews("All", "All");
  //buildMetadata(firstCategory);  

}

function categoryChanged(newCategory, newZone) {
// Fetch new data each time a new sample is selected
//console.log("New Cat/zone:" + newCategory + "-" + newZone);
  buildCharts(newCategory, newZone);
  get_reviews(newCategory, newZone);
  get_reviews_text(newCategory, newZone);
//buildMetadata(newSample);
}

function zoneChanged(newCategory, newZone) {
// Fetch new data each time a new sample is selected
//console.log("New Zone:" + newZone);
  buildCharts(newCategory, newZone);
  get_reviews(newCategory, newZone);
  get_reviews_text(newCategory, newZone);
//buildMetadata(newSample);
}

// Initialize the dashboard
console.log("Calling Init function");
init();