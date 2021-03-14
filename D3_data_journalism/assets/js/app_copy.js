// @TODO: YOUR CODE HERE!

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

// Append an SVG group
let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params    
let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";

// function used for updating x-scale let upon click on axis label
function xScale(censusData, chosenXAxis) {
    // create scales
    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) ,
        d3.max(censusData, d => d[chosenXAxis])  
        ])
        .range([0, width]);
    return xLinearScale;
}

// function used for updating y-scale let upon click on axis label
function yScale(chosenYAxis, censusData) {
    let yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d=> d[chosenYAxis]),
        d3.max(censusData, d=> d[chosenYAxis])
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


// function used for updating circles group with a transition to new circles

function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
    return circlesGroup;
}
function updateToolTip(chosenXAxis, circlesGroup) {
    let label;

    if (chosenXAxis === "poverty") {
        label = "Poverty:";
    }
    else if (chosenXAxis === "age") {
        label = "Age";
    }
    else {
        label = "Household Income:";
    }
    // Step 7: Initialize tool tip
    // ==============================
    let toolTip = d3.select("body")
        .append("div")
        .classed("tooltip", true);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function (event, d) {
        toolTip.style("display", "block")
            .html(`${d.state}</strong><hr>${label} ${d[chosenXAxis]}`)
            .style("left", event.pageX + "px")
            .style("top", event.pageY + "px");

    })
        .on("mouseout", function () {
            toolTip.style("display", "none");
        });

    return circlesGroup;
}

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

    // xLinearScale function above csv import
    let xLinearScale = xScale(censusData, chosenXAxis);

    let yLinearScale = yScale(censusData, chosenYAxis);
    // Step 3: Create axis functions
    // ==============================
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    // Add x-axis
    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    let yAxis = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .call(leftAxis);
        

    // Add y1-axis to the left side of the display
    // chartGroup.append("g")
    //     .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    let circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .classed("stateCircle", true)
        .attr("stroke-width", "1")
        .attr("stroke", "black");

    // Step 5: add text
    // ==============================
    let circlesLabel =
        chartGroup.selectAll(null).data(censusData).enter().append('text');

    console.log(circlesLabel)

    circlesLabel
        .attr("x", function (d) {
            return xLinearScale(d[chosenXAxis]);
        })
        .attr("y", function (d) {
            return yLinearScale(d.healthcare);
        })
        .text(function (d) {
            return d.abbr;
        })
        .attr("font-size", "10px")
        .classed("stateText", true);

    let labelsXGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    // Create axes labels
    let povertyLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("inactive", true)
        .text("In Poverty (%)");

    let ageLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

    let incomeLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "poverty") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");

        
    let labelsYGroup = chartGroup.append("g")
        .attr("transform", `translate`);
    // append y axis
    let healthcareLabel = labelsYGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 70)
        .attr("x", 0 - (height / 2))
        
        .classed("axis-text", true)
        .text("Lacks Healthcare (%)");

    let smokesLabel = labelsYGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 50)
        .attr("x", 0 - (height / 2))

        .classed("axis-text", true)
        .text("Smokes (%)");

    let obeseLabel = labelsYGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 30)
        .attr("x", 0 - (height / 2))
    
        .classed("axis-text", true)
        .text("Obese (%)");

    // updateToolTip function above csv import
    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);


    // x axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function () {
        // get value of selection
        let value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            // replaces chosenXAxis  with value
            chosenXAxis = value;

            // console.log(chosenXAxis)

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(censusData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenXAxis === "poverty") {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                agelabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenXAxis === "poverty"){
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", true)
                    .classed("inactive", true);
            }
        }
    });


});


