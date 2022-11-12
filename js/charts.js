function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
//DELIVERABLE 1: CREATE A HORIZONTAL BAR CHART

  // 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    console.log("Sample Array:")
    console.log(sampleArray);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var desiredSample = sampleArray.filter(sampleObj => sampleObj.id == sample);
    console.log("Selected item: ");
    console.log(desiredSample);
    //  5. Create a variable that holds the first sample in the array.
    var result = desiredSample[0];
    console.log("First sample: ");
    console.log(result);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids_Array = result.otu_ids;
    var otu_labels_Array = result.otu_labels.slice(0, 10).reverse();
    var sample_values_Array = result.sample_values.slice(0, 10).reverse();

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids_Array.map(sampleObj => "OTU " + sampleObj).slice(0,10).reverse();
    console.log("Top 10 otu_ids:")
    console.log(yticks);
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values_Array,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otu_labels_Array
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {text: "<b> Top 10 Bacteria Cultures Found"}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

//DELIVERABLE 2: CREATE A BUBBLE CHART 
    // 1. Create the trace for the bubble chart.
    var bubbleValuesArray = result.sample_values;
    var bubbleLabelsArray = result.otu_labels;
    
    var bubbleData = [{
      x: otu_ids_Array,
      y: bubbleValuesArray,
      text: bubbleLabelsArray,
      mode: "markers", 
        marker: {
           size: bubbleValuesArray,
           color: otu_ids_Array,
           colorscale: "Picnic" 
       }
   }];
  
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text: "<b> Bacteria Cultures Per Sample"},
      xaxis: {title: "OTU ID"},
      automargin: true,
      hovermode: "closest"
    };
  
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

//DELIVERABLE 3: CREATE A GAUGE CHART
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var gaugeArray = metadata.filter(metaObj => metaObj.id == sample);  

    // 2. Create a variable that holds the first sample in the metadata array.
    var gaugeResult = gaugeArray[0];

    // 3. Create a variable that holds the washing frequency.  
    var wfreqs = gaugeResult.wfreq;
    console.log("Washing frequency: ")
    console.log(wfreqs)

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wfreqs,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b> Belly Button Washing Frequency </b><br>Scrubs Per Week"},
      gauge: {
        axis: {range: [0,10], dtick: "2"},

        bar: {color: "black"},
        steps:[
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"}
        ],
        dtick: 2
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     automargin: true
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });

//DELIVERABLE 4 - CUSTOMIZE THE DASHBOARD
//The dashboard has been customized with following. Please see README for more details.
//- Add an image to the jumbotron
//- Add background color to the webpage
//- Add more information about the project as a paragraph
  
}

