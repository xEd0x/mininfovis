//dictionary to "translate" numbers into colors and vice versa
var colorToValue = {
  yellow: 16,
  pink: 8,
  blue: 4,
  red: 12,
  green: 11,
  orange: 19,
  brown: 5,
  purple: 10,
  black: 18,
  grey: 21
};

var valueToColor = {
  1: "red",
  14: "black",
  13: "orange",
  4: "grey",
  7: "blue",
  9: "brown",
  12: "green",
  23: "yellow",
  11: "pink",
  16: "purple"
};

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.json("data/data.json", function(data) {

  // X axis
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.color; }))
    .padding(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.value; })])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  var swapped = {};
  // Bars
  svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.color); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
  	.attr("fill", function(d) { return d.color; })
     	.on("click", function(d) {
        if (!swapped[d.color]) {
          d3.select(this)
            .transition()
            .duration(1000)
            .attr("y", function (d) { 
              return y(colorToValue[d.color]); 
            })
            .attr("height", function(d) { 
              return height - y(colorToValue[d.color]); 
            })
            .attr("fill", function (d) { 
              return valueToColor[d.value]; 
            });
            swapped[d.color] = true;
        }
        else {
          d3.select(this)
            .transition()
            .duration(1000)
            .attr("y", y(d.value))
            .attr("height", function(d) { 
              return height - y(d.value); 
            })
            .attr("fill", d.color);
            swapped[d.color] = false;
        }
      })
})
