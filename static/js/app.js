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

//Ordered list of unique OTU IDs
let otuIDsUniqueBySample = [...new Set(data.samples.map(item => item.otu_ids))];
let clump1 = d3.merge(otuIDsUniqueBySample);
let uniq1 = [...new Set(clump1)];
var uniqueOTUIDs = uniq1.sort(d3.descending);
var totalUniqueOTUIDs = d3.max (uniqueOTUIDs);
console.log(uniqueOTUIDs);
console.log(`The highest OTU ID is ` + d3.max (uniqueOTUIDs));
console.log(`The lowest OTU ID is ` + d3.min (uniqueOTUIDs));
console.log(`The number of unique OTU IDs is ` + uniqueOTUIDs.length);
var extentBarCharty = d3.extent(uniqueOTUIDs);

//Ordered list of unique sample values
let sampleValuesUniqueBySample = [...new Set(data.samples.map(item => item.sample_values))];
let clump2 = d3.merge(sampleValuesUniqueBySample);
let uniq2 = [...new Set(clump2)];
var uniqueSampleValues = uniq2.sort(d3.descending);
var maxSampleValue = d3.max (uniqueSampleValues);
console.log(uniqueSampleValues);
console.log(`The highest sample value is ` + d3.max (uniqueSampleValues));
console.log(`The lowest sample value is ` + d3.min (uniqueSampleValues));
console.log(`The number of different sample values is ` + uniqueSampleValues.length);
var extentBarChartx = d3.extent(uniqueSampleValues);

//Ordered list of unique OTU labels
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
var metadata_tbody = d3.select("#metadata-table tbody");
var metadata_thead = d3.select("#metadata-table thead");
var overview_tbody = d3.select("#demoOverviewTable tbody");
var overview_thead = d3.select("#demoOverviewTable thead");

//FUNCTION TO FILL DEMOGRAPHIC DATA TABLE FOR SELECTED SUBJECT
function fillTable(x) {
  //Clear existing data
    d3.select("#metadata-table").selectAll("tr").remove(); 
  //Put in new data 
    x.forEach((demoDatum) => {  
      let labelrow = metadata_thead.append("tr");
      Object.entries(demoDatum).forEach(([title, ]) => {
          let cell = labelrow.append("td");
          cell.text(title);
       });          
      let datarow = metadata_tbody.append("tr");
      Object.entries(demoDatum).forEach(([, value]) => {
          let cell = datarow.append("td");
          cell.text(value);
      });
    });
  };

//FUNCTION FOR BAR CHART OF TOP 10 OTUs FOR SELECTED SUBJECT
//Made x and y axes constant for more meaningful comparisons between samples
function barChart(currentOTUData) {
  // Organize data
    var graphData = currentOTUData[0];
    console.log(graphData);
    var graphDataArray = d3.zip(graphData.sample_values, graphData.otu_ids, graphData.otu_labels);
    
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
      }, range: extentBarChartx},
      yaxis: {title: "OTU ID", titlefont: {
        family: 'Arial, sans-serif',
        size: 18,
        color: 'black'
      }, range: extentBarCharty}
    };
    Plotly.newPlot("bar", chartData, barlayout);
};

//FUNCTION FOR BUBBLE CHART OF CURRENT OTUs FOR SELECTED SUBJECT
//Made x axis constant for more meaningful comparisons between samples
function bubbleChart(currentOTUData) {
    var graphData = currentOTUData[0];
    var graphDataArray = d3.zip(graphData.sample_values, graphData.otu_ids, graphData.otu_labels);

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

  // Specify layout
    var bubblelayout = {
      title: 'Bubble Chart Hover Text',
      showlegend: false,
      height: 600,
      width: 600,
      xaxis: {title: "OTU ID", titlefont: {
        family: 'Arial, sans-serif',
        size: 18,
        color: 'black'
      }, range: extentBarCharty},
      yaxis: {title: "Sample value"}, titlefont: {
        family: 'Arial, sans-serif',
        size: 18,
        color: 'black'
    }};

    // Render the plot to the div tag with id "bubble"  
    Plotly.newPlot('bubble', bubbledata, bubblelayout);
};

//FUNCTION FOR WASH FREQUENCY GAUGE FOR SELECTED SUBJECT
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


//FUNCTION TO UPDATE PAGE FOR SELECTED SUBJECT
function updatePage() {
  //Get id of current subject from dropdown button
  var currentSubject = dropdownMenu.value;

  //Demographic and OTU data for current subject
  var currentDemoData = data.metadata.filter(function(d) { return d.id == currentSubject; });
  var currentOTUData = data.samples.filter(function(d) { return d.id == currentSubject; });

  //Make tables and charts
  fillTable(currentDemoData);
  barChart(currentOTUData);
  bubbleChart(currentOTUData);
  washGauge(currentDemoData);
};  

//FUNCTION TO FILL DEMOGRAPHIC OVERVIEW TABLE

// Reference to button
var filterbutton = d3.select("#filter-btn");

function fillOverviewTable(x) {
  //Clear existing data (needed if get multiple comparisons working...)
  d3.select("#demoOverviewTable").selectAll("tr").remove();  
  //Put in header rows
    // x.forEach((subject) => {  
      let labelrow = overview_thead.append("tr");
      Object.entries(data.metadata[0]).forEach(([title, ]) => {
          let cell = labelrow.append("td");
          cell.text(title);
       });          
  //Add rows and fill them with data (assuming all data organized the same way)
    x.forEach((subject) => {  
      let row = overview_tbody.append("tr");
      Object.entries(subject).forEach(([, value]) => {
          let cell = row.append("td");
          cell.text(value);
        })});     
      };
//Display complete metadata dataset
tableData = data.metadata;
fillOverviewTable(data.metadata);
console.log(tableData);

//Filter button event handler
filterbutton.on("click", function() {
  //collect inputs
  idInput = d3.select("#id-input").property ("value");
  idInput =+ idInput;
  ethnicityInput = d3.select("#ethnicity-input").property ("value"); 
  genderInput = d3.select("#gender-input").property ("value"); 
  locationInput = d3.select("#location-input").property ("value"); 
  bellybuttonInput = d3.select("#bellybutton-input").property ("value"); 
  washInput = d3.select("#wash-input").property ("value");
  washInput =+ washInput;

  //filter data
  if (idInput) {selectedData1 = tableData.filter(tableData => (tableData.id === idInput))}
  else {selectedData1 = tableData};
  if (ethnicityInput) {selectedData2 = selectedData1.filter(selectedData1 => (selectedData1.ethnicity === ethnicityInput))}
  else {selectedData2 = selectedData1}; 
  if (genderInput) {selectedData3 = selectedData2.filter(selectedData2 => (selectedData2.gender === genderInput))}
  else {selectedData3 = selectedData2};

  if (d3.select("#cohortone-input").property("checked")) {selectedData4 = selectedData3}
  else {selectedData4 = selectedData3.filter(selectedData3 => (selectedData3.age >= 10))};
  if (d3.select("#cohorttwo-input").property("checked")) {selectedData5 = selectedData4}
  else {selectedData5 = selectedData4.filter(selectedData4 => (selectedData4.age >= 20 || selectedData4.age < 10))};
  if (d3.select("#cohortthree-input").property("checked")) {selectedData6 = selectedData5}
  else {selectedData6 = selectedData5.filter(selectedData5 => (selectedData5.age >= 30 || selectedData5.age < 20))};
  if (d3.select("#cohortfour-input").property("checked")) {selectedData7 = selectedData6}
  else {selectedData7 = selectedData6.filter(selectedData6 => (selectedData6.age >= 40 || selectedData6.age < 30))};
  if (d3.select("#cohortfive-input").property("checked")) {selectedData8 = selectedData7}
  else {selectedData8 = selectedData7.filter(selectedData7 => (selectedData7.age >= 50 || selectedData7.age < 40))};
  if (d3.select("#cohortsix-input").property("checked")) {selectedData9 = selectedData8}
  else {selectedData9 = selectedData8.filter(selectedData8 => (selectedData8.age >= 60 || selectedData8.age < 50))};
  if (d3.select("#cohortseven-input").property("checked")) {selectedData10 = selectedData9} 
  else {selectedData10 = selectedData9.filter(selectedData9 => (selectedData9.age < 60))};

  if (locationInput) {selectedData11 = selectedData10.filter(selectedData10 => (selectedData10.location === locationInput))}
  else {selectedData11 = selectedData10};
  if (bellybuttonInput) {selectedData12 = selectedData11.filter(selectedData11 => (selectedData11.bellybutton === bellybuttonInput))}
  else {selectedData12 = selectedData11};
  if (washInput) {selectedData13 = selectedData12.filter(selectedData12 => (selectedData12.wfreq === washInput))}
  else {selectedData13 = selectedData12};
  selectedIDs = [];
  console.log(selectedData13);
  selectedData13.forEach(element => console.log(element.id));
  selectedData13.forEach(element => selectedIDs.append[element.id]);
  console.log(selectedIDs);
//display final selection in table
  fillOverviewTable(selectedData13)});


  
  // selectedIDs = selectedData13.id;
  // console.log(selectedIDs);

// collect ID numbers for final selection
  // selectedSubjects = [];
  // selectedData13.forEach(selectedData13 => console.log(selectedData13.id));

// EVENT HANDLER
d3.selectAll("body").on("change", updatePage);
});
