// Use D3 fetch to read the JSON file
d3.json("../data/samples.json").then((sampleData) => {
    
    console.log(sampleData);
   // var data = sampleData;
// 2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.

// * Use `sample_values` as the values for the bar chart.
    
// * Use `otu_ids` as the labels for the bar chart.
    
// * Use `otu_labels` as the hovertext for the chart.