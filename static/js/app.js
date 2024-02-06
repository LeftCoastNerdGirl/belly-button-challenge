// Use D3 library to read in samples.json
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
});

function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names, use then to wait for data, and populate the drop-down selector
    d3.json(url).then((data) => {
        
        // Create a variable for the sample names
        let names = data.names;

        // Add samples to dropdown menu
        names.forEach((id) => {

            // Add the values with the loop
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample from the list 
        let sample_one = names[0];

        // Log the value of sample_one to the console
        console.log(sample_one);

        // Create the plots
        createMetadata(sample_one);
        createBarChart(sample_one);
        createBubbleChart(sample_one);
        createGaugeChart(sample_one);
    });
};

// Create function to gather metadata
function createMetadata(sample) {

    // Use D3 json to gather the data
    d3.json(url).then((data) => {

        // Pull the data
        let metadata = data.metadata;

        // Create filter for data
        let value = metadata.filter(result => result.id == sample);

        // Log to console
        console.log(value)

        // Get the first index from the array
        let valueData = value[0];

        // Clear out any old data
        d3.select("#sample-metadata").html("");

        // Add each pair to the container
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the pairs
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Create the bar chart
function createBarChart(sample) {

    // Use D3 to gather all of the data
    d3.json(url).then((data) => {

        // Gather all sample data
        let sampleInfo = data.samples;

        // Filter samples
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

         // Gather the otu_ids, labels, samples
         let otu_ids = valueData.otu_ids;
         let otu_labels = valueData.otu_labels;
         let sample_values = valueData.sample_values;

        // Log everything to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Create the top ten logic variables
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        // Create the trace for the bar chart
        let trace_bar = {
            y: yticks,
            x: xticks,
            marker: {
                color: "rgb(12, 123, 150)"
            },
            type: 'bar',
            orientation: 'h',
            text: labels
            
        };

            // The layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

         // Call Plotly to create bar chart
         Plotly.newPlot("bar", [trace_bar], layout)
        });

};

// Create the bubble chart
function createBubbleChart(sample) {
    
    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Create filter for data
        let sampleInfo = data.samples;

        // Filter samples
        let value = sampleInfo.filter(result => result.id == sample);

        // Gather the first index from the array
        let valueData = value[0];

         // Gather otu_ids, labels, samples
         let otu_ids = valueData.otu_ids;
         let otu_labels = valueData.otu_labels;
         let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Set up the trace for the bubble chart
        let trace_bubble = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Viridis",
            }
        };

        // The layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };

         // Call Plotly to create bubble chart
         Plotly.newPlot("bubble", [trace_bubble], layout)
    });
};
         
 // Create the gauge chart
function createGaugeChart(sample) {
  
    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Gather the data
        let metadata = data.metadata;

        // Filter samples
        let value = metadata.filter(result => result.id == sample);

        // Log the data
        console.log(value);

        // Get the first index from the array
        let valueData = value[0];

        // Add pairs to object
        let washFrequency = Object.values(valueData)[6];
        
        // Set up the trace for the gauge chart, find pleasing color combo
        let trace_wash = {
            value: washFrequency,
            domain: {x: [0,1], y: [0,1]},
            title: {
                text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
                font: {color: "black", size: 16}
            },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [0,10], tickmode: "linear", tick0: 2, dtick: 2},
                bar: {color: "purple"},
                steps: [
                    {range: [0, 1], color: "rgba(253, 231, 36, 0)"},
                    {range: [1, 2], color: "rgba(194, 190, 42, .5)"},
                    {range: [2, 3], color: "rgba(108, 176, 71, .5)"},
                    {range: [3, 4], color: "rgba(32, 151, 121, .5)"},
                    {range: [4, 5], color: "rgba(21, 127, 154, .5)"},
                    {range: [5, 6], color: "rgba(38, 97, 156, .5)"},
                    {range: [6, 7], color: "rgba(66, 64, 134, .5)"},
                    {range: [7, 8], color: "rgba(72, 35, 116, .5)"},
                    {range: [8, 9], color: "rgba(68, 1, 84, 0.5)"},
                    {range: [9, 10], color: "rgba(32, 0, 36, .5)"},
                ]
            } 
        };

        // The Layout
        let layout = {
            width: 600, 
            height: 400,
            margin: {t: 0, b:0}
        };

        // Call Plotly to create gauge chart
        Plotly.newPlot("gauge", [trace_wash], layout);
    });
};


// Function to update dashboard
function optionChanged(value) { 

    // Log values
    console.log(value); 

    // Call functions 
    createMetadata(value);
    createBarChart(value);
    createBubbleChart(value);
    createGaugeChart(value);
};

// Call initial function
init();