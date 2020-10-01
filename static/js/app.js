// Use D3 fetch to read the JSON file

// d3.json("./samples.json").then((sampleData) => {
//    dataArray = d3.zip(data.names, data.metadata, data.samples);
//   console.log(dataArray);
d3.json("./samples.json").then((data) => {
  console.log(data);

//  dataArray = d3.zip(data.names, data.metadata, data.samples);
//  console.log(dataArray);
 
//Add names to button
  d3.select("#selDataset")
    .selectAll('myOptions')
    .data(data.names)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }); // corresponding value returned by the button
  
  var dropdownMenu = d3.selectAll("#selDataset").node();
  var tbody = d3.select("tbody");


//Make function to update page

function updatePage() {
  //Get id of current subject from dropdown button
  var currentSubject = dropdownMenu.value;

  //DEMOGRAPHIC DATA
  //Get demographic data for current subject
  currentDemoData = data.metadata.filter(function(d) { return d.id == currentSubject; });
  
  //Put demographic data into table
  function fillTable(x) {
  //Clear existing data
    d3.select("#metadata-table tbody").selectAll("tr").remove(); 
  //Put in new data 
    x.forEach((demoDatum) => {  
      let row = tbody.append("tr");
      Object.entries(demoDatum).forEach(([, value]) => {
          let cell = row.append("td");
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
  //var currentTopOTUs = currentOTUData[0];

  //var currentTopOTUs = currentOTUData.filter(function(i){ return i<10 });
  //currentTopOTUs = currentOTUData.filter(function( ,i) { return ,i<10});
 
  
  //console.log(currentOTUArray);
  //console.log(currentTopOTUs);
  
  var trace1 = {
      x: graphDataArray.map(row => row[0]),
      y: graphDataArray.map(row => row[1]),
      text: graphDataArray.map(row => row[2]),
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
  };

  //function wheel ();





// EVENT HANDLER
d3.selectAll("body").on("change", updatePage);
});









// var trace1 = {
//     x: dataArray.map(row => row.sample_values),
//     y: dataArray.map(row => row.otu_id),
//     text: dataArray.map(row => row.otu_labels),
//     name: "Lint",
//     type: "bar",
//     orientation: "h"
//   };

//   // data
//   var chartData = [trace1];

//   // Apply the group bar mode to the layout
//   var layout = {
//     title: "Lint",
//     margin: {
//       l: 100,
//       r: 100,
//       t: 100,
//       b: 100
//     }
//   };

//   // Render the plot to the div tag with id "plot"
//    Plotly.newPlot("plot", chartData, layout);
// });





