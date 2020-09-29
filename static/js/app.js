function init () {

    var dropdownMenu = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
    
        var sampleID = data.names;
        sampleID.forEach((sample) => {
            dropdownMenu
            .append("option")
            .text(sample)
            .property("value", sample);
        });
    
        var firstSampleID = sampleID[0];
        buildBarChart(firstSampleID)
        buildBubbleChart(firstSampleID)
        buildMetaData(firstSampleID)
});
}

function buildBarChart (sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var filteredsamples = samples.filter(d => d.id === sample);

        var sampleValues = filteredsamples[0].sample_values;
        var otuIds = filteredsamples[0].otu_ids;
        var otuLabels = filteredsamples[0].otu_labels;

        var trace = { 
            x: sampleValues.slice(0,10).reverse(),
            y: otuIds.slice(0,10).map(otuId => `OTD ${otuId}`).reverse(),
            hovertext: otuLabels,
            type: "bar",
            orientation: "h"
        };

        var data = [trace]

        Plotly.newPlot("bar",data);
    });
};

function buildBubbleChart(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var filteredsamples = samples.filter(d => d.id == sample);

        var sampleValues = filteredsamples[0].sample_values;
        var otuIds = filteredsamples[0].otu_ids;
        var otuLabels = filteredsamples[0].otu_labels;

        var trace = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
              size: sampleValues,
              color: otuIds
            }
        };

        var data = [trace]

        Plotly.newPlot("bubble", data);
    });
};

function buildMetaData(sample) {

    d3.json("samples.json").then((data) => {
        
        var metadata = data.metadata;

        var fitleredmetadata = metadata.filter(d => d.id == sample);
        
        var panel = d3.select("#sample-metadata");

        panel.html("");

        Object.entries(fitleredmetadata[0]).forEach(([key, value]) => {
            panel.append("h6").text(`${key}:${value}`);
        });   

    });
};

function optionChanged(newSampleId) {
    buildBubbleChart(newSampleId);
    buildMetaData(newSampleId);
    buildBarChart(newSampleId);
}

init();
