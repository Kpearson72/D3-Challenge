    // @TODO: YOUR CODE HERE!
// function to make responsive
function makeResponsive(){

    // remove and replace svg after each pick
    let svgArea = d3.select("body").select("svg");

    // Clear SVG is Not Empty
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    let svgWidth = 960;
    let svgHeight = 500;

    let margin = {
        top: 20,
        right: 40,
        bottom: 80,
        left: 120
    };

    let width = svgWidth - margin.left - margin.right;
    let height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    let svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    // set chartGroup with appending group elements and setting margins
    let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Initial Params

    let chosenXAxis = "poverty";
    let chosenYAxis = "healthcare";

    // function used for updating x-scale upon click on axis label
    function xScale(censusData, chosenXAxis) {
        // create scales
        let xLinearScale = d3.scaleLinear()
            .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
            d3.max(censusData, d => d[chosenXAxis]) *1.2 
            ])
            .range([0, width]);
        return xLinearScale;
    }


}
makeResponsive();