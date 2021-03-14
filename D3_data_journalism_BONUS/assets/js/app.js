// function to make responsive        
// ==============================
function makeResponsive(){

    // remove and replace svg after each pick
     // ==============================
    let svgArea = d3.select("body").select("svg");

    // Clear SVG is Not Empty
    // ==============================
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
    // ==============================
    let svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    // set chartGroup with appending group elements and setting margins
    // ==============================
    let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Initial Params
    // ==============================

    let chosenXAxis = "poverty";
    let chosenYAxis = "healthcare";

    // function used for updating x-scale upon click on axis label        
    // ==============================
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
    // ==============================
    function yScale(chosenYAxis, censusData) {
        let yLinearScale = d3.scaleLinear()
            .domain([d3.min(censusData, d=> d[chosenYAxis]) * 0.8,
            d3.max(censusData, d=> d[chosenYAxis]) * 1.2
            ])
            .range([height,0]);
        return yLinearScale;
    }

    // function used for updating xAxis let upon click on axis Label
    // ==============================
    function setXAxes(newXScale, xAxis) {
        let bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
    }

    // function used for updating yAxis let upon click on axis label
    // ==============================
    function setYAxes(newYScale, yAxis) {
        let leftAxis = d3.axisLeft(newYScale);

            yAxis.transition()
                .duration(1000)
                .call(leftAxis);
                
            return yAxis;
    }
    // function used for updating circles group to new
    // ==============================
    function setCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
        textGroup.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]))
            .attr("y", d => newYScale(d[chosenYAxis]))
            .attr("text-anchor", "middle");

        return circlesGroup;
    }

    // function used for updating text group to new
    // ==============================
    function setText(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
        textGroup.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]))
            .attr("y", d => newYScale(d[chosenYAxis]))
            .attr("text-anchor", "middle");

        return circlesGroup;
    }

    // function to update circle group using Tooltip
    // ==============================
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

        // Initialize tool tip
        // ==============================
        let toolTip = d3.tip()
            .classed("tooltip d3-tip", true)
            .offset([90, 90])
            .html(function (d) {
                return (`<strong>${d.abbr}</strong><br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
            });
        // Create Circles Tooltip in the Chart
        circlesGroup.call(toolTip);
        // Create event listeners to display and hide the tooltip
        circlesGroup.on("mouseover", function (data) {
            toolTip.show(data, this);
        })
         // mouseout Event
            .on("mouseout", function (data) {
            toolTip.hide(data);
            });

        textGroup.call(toolTip);
        textGroup.on("mouseover", function (data){
            toolTip.show(data,this);
        })
            //mouse out event
            .on("mouseout",function(data){
                toolTip, hide(data);
            });

        return circlesGroup;

    }
    // Import Data
    // ==============================
    d3.csv("assets/data/data.csv").then(function (censusData) {
        
        // Parse Data/Cast as numbers
        // ==============================
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
        // ==============================       
        let xLinearScale = xScale(censusData, chosenXAxis);

        let yLinearScale = yScale(censusData, chosenYAxis);
        // Create axis functions
        // ==============================
        let bottomAxis = d3.axisBottom(xLinearScale);
        let leftAxis = d3.axisLeft(yLinearScale);

        // Append Axes to the chart
        // ==============================
        // x-axis
        let xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        // y-axis
        let yAxis = chartGroup.append("g")
            .classed("y-axis",true)
            .call(leftAxis);

        // Create Circles
        // ==============================
        let circlesGroup = chartGroup.selectAll(".stateCircle")
            .data(censusData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("opacity", ".80")
            .attr("r", "10")
            .classed("stateCircle", true);

        // Append text to circles
        // ==============================
        let textGroup = chartGroup.selectAll(".stateText")
            .data(acsData)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis] * .98))
            .text(d => (d.abbr))
            .classed("stateText", true)
            .attr("font-size", "10px")
            .attr("text-anchor", "middle")
            .attr("fill", "white");   
    
        // Create Group of 3 xAxis Labels
        // ==============================
        let labelsXGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

        // Create axes labels for x
        // ==============================
        let povertyLabel = labelsXGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", true)
            .text("In Poverty (%)");

        let ageLabel = labelsXGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age (Median)");

        let incomeLabel = labelsXGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") // value to grab for event listener
            .classed("inactive", true)
            .text("Household Income (Median)");

        // Create Group of 3 yAxis Labels
        // ==============================
        let labelsYGroup = chartGroup.append("g")
            .attr("transform", `translate`);

        // Create axes labels for y
        // ==============================
        let healthcareLabel = labelsYGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", - 30)
            .attr("x",  0)
            .classed("active", true)
            .classed("axis-text", true)
            .attr("value", "health") // value to grab for event listener
            .text("Lacks Healthcare (%)");

        let smokesLabel = labelsYGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", 0)
            .classed("inactive", true)
            .attr("value", "smokes") // value to grab for event listener
            .classed("axis-text", true)
            .text("Smokes (%)");

        let obeseLabel = labelsYGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -70)
            .attr("x", 0)
            .classed("inactive", true)
            .attr("value", "obesity") // value to grab for event listener
            .classed("axis-text", true)
            .text("Obese (%)");

        // updateToolTip function above csv import
        // ==============================
        let circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

        labelsXGroup.selectAll("text")
            .on("click",function(){
                let value = d3.select(this).attr("value");
                if (value !== chosenXAxis) {
                    // replaces Value
                    chosenXAxis = value;
                    // updating xScale for new census data
                    xLinearScale = xScale(censusData, chosenXAxis);
                    // updating xAxis 
                    xAxis = setXAxes(xLinearScale, xAxis);
                    // updating Circles 
                    circlesGroup = setCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                    // updating Text 
                    textGroup = setText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
                    // updating Tooltips 
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
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
                        .classed("active", false)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", true);
                }
            }
                
        });      

            labelsYGroup.selectAll("text")
            .on("click",function(){
                let value = d3.select(this).attr("value");
                if (value !== chosenYAxis) {
                    // replaces Value
                    chosenYAxis = value;
                    // updating xScale for new census data
                    xLinearScale = xScale(censusData, chosenYAxis);
                    // updating xAxis 
                    yAxis = setXAxes(yLinearScale, xAxis);
                    // updating Circles 
                    circlesGroup = setCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                    // updating Text 
                    textGroup = setText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
                    // updating Tooltips 
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
                if (chosenyAxis === "poverty") {
                    heathLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeslabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenyAxis === "poverty"){
                    healthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    healthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", true);
                }
            }
                
        });      
    });
}
makeResponsive();

d3.select(window).on("resize", makeResponsive);