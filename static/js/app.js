// Use D3 fetch to read the JSON file
//d3.json("samples.json").then((sampleData) => {
d3.json("/samples.json").then((data) => {
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

//Set up place for demographic info
//age, bbtype, ethnicity, gender, id, location, wfreq

// Reference to table body
var tbody = d3.select("tbody");
//Function to display selected data in table - fix to be for selected subject
function fillTable(x) {
  //Clear existing data
  d3.select("#metadata-table tbody").selectAll("tr").remove();  
  //Add rows and fill them with data (assuming all data organized the same way)
  x.forEach((subject) => {  
      let row = tbody.append("tr");
      Object.entries(subject).forEach(([, value]) => {
          let cell = row.append("td");
          cell.text(value);
      });
  });
};




//Make function to update page

function updatePage() {
  //Clear existing data from charts

  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.selectAll("#selDataset").node();
  // Assign the dropdown menu item ID to a variable
  var dropdownMenuID = dropdownMenu.id;
  // Assign the dropdown menu option to a variable
  var selectedOption = dropdownMenu.value;
  //Put demographic data into box
  
  
  
  //Sort data on "sample_values" (descending)

  //select top 10 OTUS for chart

  console.log(dropdownMenuID);
  console.log(selectedOption);
}

// Use D3 to create an event handler
d3.selectAll("body").on("change", updatePage);




// var dropdownChange = function() {
//   var newName = d3.select(this).property('value'),
//       newName   = cerealMap[newCereal];

//   updateBars(newData);
// };

// var dropdown = d3.select("#selDataset")
//     .insert("select", "svg")
//     .on("change", dropdownChange);

// dropdown.selectAll("option")
//     .data(names)
//   .enter().append("option")
//     .attr("value", function (d) { return d; });
  


// 2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.

// * Use `sample_values` as the values for the bar chart.
    
// * Use `otu_ids` as the labels for the bar chart.
    
// * Use `otu_labels` as the hovertext for the chart

  // Sort the data array using the greekSearchResults value
  // var sorted = sample_values.sort(function sortFunction(a, b) {
  //   return b - a;
  // });

  // Slice the first 10 objects for plotting
  // data = data.slice(0, 10);

  // Reverse the array due to Plotly's defaults
  // data = data.reverse();


var trace1 = {
    x: dataArray.map(row => row.sample_values),
    y: dataArray.map(row => row.otu_id),
    text: dataArray.map(row => row.otu_labels),
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

  // Render the plot to the div tag with id "plot"
   Plotly.newPlot("plot", chartData, layout);
});
