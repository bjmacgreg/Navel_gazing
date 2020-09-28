// Use D3 fetch to read the JSON file
d3.json("samples.json").then((sampleData) => {
        console.log(sampleData);
    var data = sampleData;
// 2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.

// * Use `sample_values` as the values for the bar chart.
    
// * Use `otu_ids` as the labels for the bar chart.
    
// * Use `otu_labels` as the hovertext for the chart
var trace1 = {
    x: data.map(row => row.sample_values),
    y: data.map(row => row.otu_id),
    text: data.map(row => row.otu_labels),
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
