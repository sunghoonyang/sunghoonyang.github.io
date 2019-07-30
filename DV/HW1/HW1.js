//Width and height
var geojson_url = 'https://raw.githubusercontent.com/hvo/datasets/master/nyc_zip.geojson';
var cuisine_url = 'https://raw.githubusercontent.com/hvo/datasets/master/nyc_restaurants_by_cuisine.json';
var w = 1600;
var h = 1000;

// Bar Chart
Promise.all([
    d3.json(cuisine_url),
    d3.json(geojson_url)
]).then(function (files) {
    createPlot(files);
});

function createPlot(data) {
    var barChartData = data[0].map((row, i) => {
        return [row.cuisine, row.total, i, row.perZip]
    }).slice(0, 25);
    var svg = d3.select("body").append("svg")
        .attr("width", w)
        .attr("height", h);
    // .attr("transform", "translate(-400, 50)");


    var maxValue = d3.max(barChartData, d => d[1]);
    var minValue = d3.min(barChartData, d => d[1]);
    var x = d3.scaleLinear()
        .domain([minValue, maxValue])
        .rangeRound([0, 300]);
    var y = d3.scaleBand()
        .domain(
            barChartData.map((d, i) => d[0])
        )
        .rangeRound([10, 700]);


    var barChart = svg.append("g")
        .attr("transform", "translate(0, 50)");

    var yAxis = d3.axisLeft(y);
    var xAxis = d3.axisBottom(x);

    function make_x_gridlines() {
        return xAxis.ticks(9).tickSize(-w)
            .tickFormat("")
    }

    // Axes
    barChart.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(175, 0)")
        .call(yAxis)

    var gXAxis = barChart.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(175, 700)")
        .call(xAxis)

    barChart.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(175, 0)")
        .call(xAxis);

    // X-Axis Gridline
    gXAxis.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + 0 + ")")
        .attr("transform", "scale(1, 0.44)")
        .call(make_x_gridlines());

    // Cuisine Label
    barChart.append('text')
        .attr('class', 'label')
        .attr('id', 'y-axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -y.range()[1] * 0.6)
        .attr('y', 90)
        .attr("font-size", "18px")
        .text('Cuisine');

    var tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip');

    // Number of Restaurants Label
    barChart.append('text')
        .attr('class', 'label')
        .attr('id', 'x-axis-label')
        .attr('x', x.range()[1] * 0.75)
        .attr('y', 750)
        .attr("font-size", "18px")
        .text('Number of Restaurants');

    barChart.selectAll('.bar')
        .data(barChartData)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('id', function (d) {
            return "bar" + d[2].toString()
        })
        .attr("transform", "translate(175, 0)")
        .attr('x', 1)
        .attr('y', (d, i) => y(d[0]))
        .attr('width', (d, i) => x(d[1]))
        .attr('height', y.bandwidth() - 2)
        .style("fill", "LightGrey")
        .style("stroke", "black")
        .on('mouseover', function (d) {
                // highlight barchart
                d3.select(this)
                    .transition().ease(d3.easeBounce).duration(500)
                    .attr('x', 0)
                    .attr('y', y(d[0]) - 2)
                    .attr('width', x(d[1]) + 20)
                    .attr('height', y.bandwidth() + 2)
                    .style("fill", "steelblue");
                tooltip.text(d[1]);
                tooltip.style('visibility', 'visible');

                // highlight map
                var name = d[0];
                var perZip = d[3];
                var perZipVals = Object.keys(perZip).map(function (key) {
                    return perZip[key];
                });
                var colorMaxValue = d3.max(perZipVals);
                var colorMinValue = d3.min(perZipVals);
                var colorDomain = d3.range(colorMinValue, colorMaxValue, (colorMaxValue - colorMinValue) / 5);

                var color = d3.scaleThreshold()
                    .domain(colorDomain)
                    .range(d3.schemeBlues[5]);

                for (var key in perZip) {
                    d3.select('#zip' + key.toString())
                        .transition().ease(d3.easeBounce).duration(500)
                        .style("fill", color(perZip[key]));
                }
                // Legend
                var legendInterval = 45;
                // remove previous
                svg.select("#legend").remove();

                svg.append("g").attr("transform", "translate(600, 70)").attr('id', 'legend');
                d3.select('#legend')
                    .attr('class', 'label')
                    .append('text')
                    .attr("font-size", "22px")
                    .attr("x", 0)
                    .text('Number of ' + d[0] + ' Restaurants');

                colorDomain.forEach((d, i) => {
                    d3.select('#legend')
                        .append('rect')
                        .attr("height", 12)
                        .attr("x", i * legendInterval)
                        .attr("y", 15)
                        .attr("width", legendInterval)
                        .style("fill", color(d));
                    d3.select('#legend')
                        .append('text')
                        .attr("height", 8)
                        .attr("x", i * legendInterval + 5)
                        .text(Math.round(d).toString())
                        .attr("y", 45);
                    d3.select('#legend')
                        .append("line")          // attach a line
                        .style("stroke", "black")  // colour the line
                        .attr("x1", (i + 1) * legendInterval)     // x position of the first end of the line
                        .attr("y1", 10)      // y position of the first end of the line
                        .attr("x2", (i + 1) * legendInterval)     // x position of the second end of the line
                        .attr("y2", 30)
                        .style('stroke-width', '4px');
                })
            }
        )

        .on('mousemove', function () {
            tooltip.style('top', (d3.event.pageY + 20) + "px")
                .style('left', (d3.event.pageX + 10) + "px");

        })
        .on('mouseout', function (d) {
            d3.select(this)
                .transition().duration(300)
                .attr('x', 0)
                .attr('y', y(d[0]))
                .attr('width', x(d[1]))
                .attr('height', y.bandwidth() - 2)
                .style("fill", "LightGrey");
            tooltip.style('visibility', 'hidden');
        });

// Map Population
    var mercator = d3.geoMercator()
        .center([-73.878025, 40.654698])
        .translate([w * 0.5, h * 0.6])
        .scale([h * 70]);

    var path = d3.geoPath().projection(mercator);


    d3.json(geojson_url).then((json) => {
        svg.append('g').attr("transform", "translate(250, 0)")
            .selectAll('path').data(json.features)
            .enter()
            .append('path')
            .attr("id", function (d) {
                return "zip" + d.properties.zipcode.toString()
            })
            .attr("d", path)
            .style("fill", "LightGrey");

    });


}
