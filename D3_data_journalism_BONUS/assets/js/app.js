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
            d3.max(censusData, d => d[chosenXAxis]) * 1.2 
            ])
            .range([0, width]);
        return xLinearScale;
    }

    // function used for updating y-scale let upon click on axis label
    function yScale(chosenYAxis, censusData) {
        let yLinearScale = d3.scaleLinear()
            .domain([d3.min(censusData, d=> d[chosenYAxis]) * 0.8,
            d3.max(censusData, d=> d[chosenYAxis]) * 1.2
            ])
            .range([height,0]);
        return yLinearScale;
    }

    // function used for updating xAxis let upon click on axis Label
    function renderXAxes(newXScale, xAxis) {
        let bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
    }

    // function used for updating yAxis let upon click on axis label
    function renderYAxes(newYScale, yAxis) {
        let leftAxis = d3.axisLeft(newYScale);

            yAxis.transition()
                .duration(1000)
                .call(leftAxis);
                
            return yAxis;
    }
    // function used for updating circles group to new
    function setCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
        textGroup.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]))
            .attr("y", d => newYScale(d[chosenYAxis]))
            .attr("text-anchor", "middle");

        return circlesGroup;
    }

    // function used for updating text group to new
    function setText(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
        textGroup.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]))
            .attr("y", d => newYScale(d[chosenYAxis]))
            .attr("text-anchor", "middle");

        return circlesGroup;
    }

    // function to update circle group using Tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {

        if (chosenXAxis === "poverty") {
            let xLabel = "Poverty (%)";
        }
        else if (chosenXAxis === "age") {
            let xLabel = "Age (Median)";
        }
        else {
            let xLabel = "Household Income (Median)";
        }
        if (chosenYAxis === "healthcare") {
            let yLabel = "Lacks Healthcare (%)";
        }
        else if (chosenYAxis === "obesity") {
            let yLabel = "Obese (%)";
        }
        else {
            let yLabel = "Smokes (%)";
        }



}
makeResponsive();