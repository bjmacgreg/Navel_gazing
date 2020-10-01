// Use D3 fetch to read the JSON file

// d3.json("./samples.json").then((sampleData) => {
//    dataArray = d3.zip(data.names, data.metadata, data.samples);
//   console.log(dataArray);
d3.json("./samples.json").then((data) => {
  console.log(data);

  dataArray = d3.zip(data.names, data.metadata, data.samples);
  console.log(dataArray);
 
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
  //Clear existing data from charts

  //Get id of current subject from dropdown button
  var currentSubject = dropdownMenu.value;
  console.log(currentSubject);

  //Get demographic data for current subject
  selection = dataArray.filter(function(d) { return d.id == currentSubject; });
  console.log(selection.id);
  // d3.select("#metadata-table tbody").selectAll("tr").remove(); 
  // let row = tbody.append("tr");  
  // Object.entries(subject).forEach(([, value]) => {
  //   let cell = row.append("td");
  //   cell.text(value);
  
  //Sort data on "sample_values" (descending)

  //select top 10 OTUS for chart

  //console.log(dropdownMenuID);
  //console.log(selectedOption);
};


//updatePage()

// Use D3 to create an event handler
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
