// @TODO: YOUR CODE HERE!


let svgWidth = 960;
let svgHeight = 600;

let margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
let svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function (censusData) {

    // Step 1: Parse Data/Cast as numbers
    censusData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
    });
    console.log(censusData);

    // Step 2: Create scale functions
    // ==============================
    let xPovertyScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.poverty)-1, d3.max(censusData, d => d.poverty)+2])
        .range([0, width]);


    let yHealthScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.healthcare)-.4, d3.max(censusData, d => d.healthcare)+2])
        .range([height, 0]);



    

}).catch(function (error) {
    console.log(error);
});


