// Use D3 fetch to read the JSON file
d3.json("./samples.json").then((data) => {
console.log(data);

// COLLECT AND INSPECT UNIQUE VALUES OF VARIABLES
// Thanks https://codepen.io/vlad-bezden/pen/OMEXJz?editors=0012
var uniqueIDs = [...new Set(data.metadata.map(item => item.id))];
console.log(uniqueIDs);
var uniqueEthnicities = [...new Set(data.metadata.map(item => item.ethnicity))];
console.log(uniqueEthnicities.sort(d3.ascending));
var uniqueGenders = [...new Set(data.metadata.map(item => item.gender))];
console.log(uniqueGenders);
var uniqueLocations = [...new Set(data.metadata.map(item => item.location))];
console.log(uniqueLocations.sort(d3.ascending));
var uniqueBBtypes = [...new Set(data.metadata.map(item => item.bbtype))];
console.log(uniqueBBtypes);
var uniqueWFreqs = [...new Set(data.metadata.map(item => item.wfreq))];
console.log(uniqueWFreqs.sort(d3.ascending));

//Ordered list of unique OTU IDs (length 1160, max value 3663)
let otuIDsUniqueBySample = [...new Set(data.samples.map(item => item.otu_ids))];
let clump1 = d3.merge(otuIDsUniqueBySample);
let uniq1 = [...new Set(clump1)];
var uniqueOTUIDs = uniq1.sort(d3.descending);
var totalUniqueOTUIDs = d3.max (uniqueOTUIDs);
console.log(uniqueOTUIDs);
console.log(`The highest OTU ID is ` + d3.max (uniqueOTUIDs));
console.log(`The lowest OTU ID is ` + d3.min (uniqueOTUIDs));
console.log(`The number of unique OTU IDs is ` + uniqueOTUIDs.length);

//Ordered list of unique sample values (length 246, max value 1305)
let sampleValuesUniqueBySample = [...new Set(data.samples.map(item => item.sample_values))];
let clump2 = d3.merge(sampleValuesUniqueBySample);
let uniq2 = [...new Set(clump2)];
var uniqueSampleValues = uniq2.sort(d3.descending);
var maxSampleValue = d3.max (uniqueSampleValues);
console.log(uniqueSampleValues);
console.log(`The highest sample value is ` + d3.max (uniqueSampleValues));
console.log(`The lowest sample value is ` + d3.min (uniqueSampleValues));
console.log(`The number of different sample values is ` + uniqueSampleValues.length);

//Ordered list of unique OTU labels (length 245, max value 1305)
let otuLabelsUniqueBySample = [...new Set(data.samples.map(item => item.otu_labels))];
let clump3 = d3.merge(otuLabelsUniqueBySample);
let uniq3 = [...new Set(clump3)];
var uniqueOTULabels = uniq3.sort(d3.ascending);
//var maxSampleValue = d3.max (uniqueSampleValues);
console.log(uniqueOTULabels);
console.log(`The number of different OTU labels is ` + uniqueOTULabels.length);

//ADD NAMES TO BUTTON
d3.select("#selDataset")
  .selectAll('myOptions')
  .data(data.names)
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }); // corresponding value returned by the button
  
var dropdownMenu = d3.selectAll("#selDataset").node();
var tbody = d3.select("tbody");
var thead = d3.select("thead");

//FUNCTION TO FILL DEMOGRAPHIC DATA TABLE
function fillTable(x) {
  //Clear existing data
    d3.select("#metadata-table").selectAll("tr").remove(); 
  //Put in new data 
    x.forEach((demoDatum) => {  
      let labelrow = thead.append("tr");
      Object.entries(demoDatum).forEach(([title, ]) => {
          let cell = labelrow.append("td");
          cell.text(title);
       });          
      let datarow = tbody.append("tr");
      Object.entries(demoDatum).forEach(([, value]) => {
          let cell = datarow.append("td");
          cell.text(value);
      });
    });
  };

//FUNCTION FOR BAR CHART OF TOP 10 OTUs
function barChart(currentOTUData) {
    var graphData = currentOTUData[0];
    //console.log(graphData);
    var graphDataArray = d3.zip(graphData.sample_values, graphData.otu_ids, graphData.otu_labels);
    //console.log(graphDataArray);
    // Select data for graph and choose graph type
    var trace1 = {
      x: graphDataArray.slice(0,10).map(row => row[0]),
      y: graphDataArray.slice(0,10).map(row => row[1]),
      text: graphDataArray.slice(0,10).map(row => row[2]),
      name: "Lint",
      type: "bar",
      orientation: "h"
    };

    var chartData = [trace1];

  // Specify layout
    var barlayout = {
      title: "Lint",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100},
      
      xaxis: {title: "Sample value", titlefont: {
        family: 'Arial, sans-serif',
        size: 18,
        color: 'black'
      }},
      yaxis: {title: "OTU ID", titlefont: {
        family: 'Arial, sans-serif',
        size: 18,
        color: 'black'
      }}
    };
    Plotly.newPlot("bar", chartData, barlayout);
};

//FUNCTION FOR BUBBLE CHART OF TOP 10 OTUs
function bubbleChart(currentOTUData) {
    var graphData = currentOTUData[0];
    // console.log(graphData);
    var graphDataArray = d3.zip(graphData.sample_values, graphData.otu_ids, graphData.otu_labels);
    // console.log(graphDataArray);
    //Set bubble size and color
    var size = graphDataArray.map(row => row[0]);
    var color = graphDataArray.map(row => row[1]);

    // Select data for graph and choose graph type
    var trace1 = {
      x: graphDataArray.map(row => row[1]), 
      y: graphDataArray.map(row => row[0]),
      text: graphDataArray.map(row => row[2]),
      mode: 'markers',
      marker: {
        color:color,
        size: size,
        colorscale: 'viridis'
      }
    };

    var bubbledata = [trace1];

    var bubblelayout = {
      title: 'Bubble Chart Hover Text',
      showlegend: false,
      height: 600,
      width: 600,
      xaxis: {title: "OTU ID", titlefont: {
        family: 'Arial, sans-serif',
        size: 18,
        color: 'black'
      }},
      yaxis: {title: "Sample value"}, titlefont: {
        family: 'Arial, sans-serif',
        size: 18,
        color: 'black'
    }};

    // Render the plot to the div tag with id "bubble"  
    Plotly.newPlot('bubble', bubbledata, bubblelayout);
};

//FUNCTION FOR WASH FREQUENCY GAUGE
function washGauge(currentDemoData) {
    washfreq = currentDemoData[0].wfreq;
    var washdata = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washfreq,
        title: { text: "Washing frequency" },
        type: "indicator",
        mode: "gauge+number",
        delta: { reference: 380 },
        gauge: {
          axis: { range: [null, 9] }
          }
        }
    ];
    var washlayout = { width: 600, height: 450, margin: { t: 0, b: 0 }};
    Plotly.newPlot('gauge', washdata, washlayout);
};


//FUNCTION TO UPDATE PAGE
function updatePage() {
  //Get id of current subject from dropdown button
  var currentSubject = dropdownMenu.value;
  // console.log(currentSubject);

  //Demographic and OTU data for current subject
  var currentDemoData = data.metadata.filter(function(d) { return d.id == currentSubject; });
  //console.log(currentDemoData);
  var currentOTUData = data.samples.filter(function(d) { return d.id == currentSubject; });
  // console.log(currentOTUData);

  //Make tables and charts
  fillTable(currentDemoData);
  barChart(currentOTUData);
  bubbleChart(currentOTUData);
  washGauge(currentDemoData);

};  

// EVENT HANDLER
d3.selectAll("body").on("change", updatePage);
});



