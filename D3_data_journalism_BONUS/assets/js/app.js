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



}
makeResponsive();