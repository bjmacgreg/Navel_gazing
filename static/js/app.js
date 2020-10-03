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
console.log(`The number of unique OTU IDs is ` + uniqueOTUIDs.length);

//Ordered list of unique sample values (length 246, max value 1305)
let sampleValuesUniqueBySample = [...new Set(data.samples.map(item => item.sample_values))];
let clump2 = d3.merge(sampleValuesUniqueBySample);
let uniq2 = [...new Set(clump2)];
var uniqueSampleValues = uniq2.sort(d3.descending);
var maxSampleValue = d3.max (uniqueSampleValues);
console.log(uniqueSampleValues);
console.log(`The highest sample value is ` + d3.max (uniqueSampleValues));
console.log(`The number of different sample values is ` + uniqueSampleValues.length);

//Ordered list of unique sample values (length 246, max value 1305)
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

//MAKE FUNCTION TO UPDATE PAGE
function updatePage() {
  //Get id of current subject from dropdown button
  var currentSubject = dropdownMenu.value;
  // console.log(currentSubject);

  //DEMOGRAPHIC DATA
  //Get demographic data for current subject
  currentDemoData = data.metadata.filter(function(d) { return d.id == currentSubject; });
  console.log(currentDemoData);
  //Put demographic data into table
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

  fillTable(currentDemoData);

  //BAR CHART OF TOP 10 OTUs
  //Get OTU data for current subject
  var currentOTUData = data.samples.filter(function(d) { return d.id == currentSubject; });
  console.log(currentOTUData);
  var graphData = currentOTUData[0];
  console.log(graphData);
  var graphDataArray = d3.zip(graphData.sample_values, graphData.otu_ids, graphData.otu_labels);
  console.log(graphDataArray);
  
  var trace1 = {
      x: graphDataArray.slice(0,10).map(row => row[0]),
      y: graphDataArray.slice(0,10).map(row => row[1]),
      text: graphDataArray.slice(0,10).map(row => row[2]),
      // x: currentOTUData.map(row => row.sample_values),
      // y: currentOTUData.map(row => row.otu_ids),
      // text: currentOTUData.map(row => row.otu_labels),
      name: "Lint",
      type: "bar",
      orientation: "h"
    };

  // data
    var chartData = [trace1];

  // Apply the group bar mode to the layout
    var layout = {
      title: "Lint",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    
    };

  // Render the plot to the div tag with id "bar"
   Plotly.newPlot("bar", chartData, layout);
  

  //BUBBLE CHART
  var graphDataArray = d3.zip(graphData.sample_values, graphData.otu_ids, graphData.otu_labels);

  // var currentOTUData = data.samples.filter(function(d) { return d.id == currentSubject; });
  // console.log(currentOTUData);

  //Sizes etc.: see https://plotly.com/javascript/bubble-maps/
  
  var trace1 = {
    x: graphDataArray.map(row => row[0]), 
    y: graphDataArray.map(row => row[1]),
    text: graphDataArray.map(row => row[2]),
    mode: 'markers',
    marker: {
      color:graphDataArray.map(row => row[0]),
      size: graphDataArray.map(row => row[1]).value,
      colorscale: 'Greens'
    }
  };
  
  var bubbledata = [trace1];
  
  var layout = {
    title: 'Bubble Chart Hover Text',
    showlegend: false,
    height: 600,
    width: 600
  };
  
  Plotly.newPlot('bubble', bubbledata, layout);
  
  
  
};  
  
  
  //function wheel ();





// EVENT HANDLER
d3.selectAll("body").on("change", updatePage);
});









// var trace1 = {
//   x: [1, 2, 3, 4],
//   y: [10, 11, 12, 13],
//   text: ['A<br>size: 40', 'B<br>size: 60', 'C<br>size: 80', 'D<br>size: 100'],
//   mode: 'markers',
//   marker: {
//     color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
//     size: [40, 60, 80, 100]
//   }
// };

// var data = [trace1];

// var layout = {
//   title: 'Bubble Chart Hover Text',
//   showlegend: false,
//   height: 600,
//   width: 600
// };

// Plotly.newPlot('myDiv', data, layout);




