drawPieChart('pie-data.csv', 'simple-pie-chart');
setTimeout(function() {
    drawPieChart('pie-data-booking.csv', 'simple-pie-booking-chart');
}, 2000);


/*  ------------------------------------------------------------------------    */
/**
 * This function is used to plot a pie chart.
 * 
 * @version     0.0.1
 * @returns     Plots a pie chart.
 */
function drawPieChart(fileName, chartContainer) {

    var width = $('.'+chartContainer+'-wrapper').width(),
            height = 300,
            radius = (width / 2.5),
            color = d3.scale.category20c();

    d3.csv('assets/data/'+fileName, function(d) {
        var data = d;
        
        var vis = d3.select('.'+chartContainer+'-wrapper')
                .append("svg:svg")
                .data([data])
                .attr("width", width)
                .attr("height", height)
                .append("svg:g")
                .attr("transform", "translate(" + radius * 1.1 + "," + radius * 1.1 + ")");

        var arc = d3.svg.arc()
                .outerRadius(radius);

        var arcOver = d3.svg.arc()
                .innerRadius(10)
                .outerRadius(radius + 10);

        var pie = d3.layout.pie()
                    .value(function(d) {
                        return d['share'];
                    });

        var arcs = vis.selectAll("g.slice")
                      .data(pie)
                      .enter()
                      .append("svg:g")
                      .attr("class", "slice");

        arcs.append("svg:path")
                .attr("fill", function(d, i) {
                    return color(i);
                })
                .attr("d", arc);

        arcs.append("svg:text")
                .attr("transform", function(d) {
                    d.innerRadius = 0;
                    d.outerRadius = radius;
                    return "translate(" + arc.centroid(d) + ")";
                })
                .attr("text-anchor", "middle") //center the text on it's origin
                .text(function(d, i) {
                    return ' ';
                });
        var total = 0;
        data.forEach(function(d,i){
            total = total + parseFloat(d['share']);
        });
        /*  creating the legends  */
        var legend = d3.select('.'+chartContainer+'-legend')
                        .append("svg")
                        .attr("class", "legend")
                        .attr("width", $('.'+chartContainer+'-legend').width())
                        .attr("height", 200)
                        .selectAll("g")
                        .data(color.domain().slice().reverse())
                        .enter().append("g")
                        .attr("transform", function(d, i) {
                            return "translate(0," + i * 20 + ")";
                        });
         
            legend.append("rect")
                    .attr("width", 10)
                    .attr("height", 10)
                    .style("fill", color);
         
            legend.append("text")
                    .attr("x", 18)
                    .attr("y", 6)
                    .attr("dy", ".35em")
                    .text(function(d, i) {
                        return data[i]['medium'] + ' : '+ ((parseFloat(data[i]['share']) / total)*100).toFixed(2) + '%';
                    }); 

                
        data.forEach(function(d, i) {
            d3.select('path#' + d.state) //select the group matching the id
                    .attr("fill", color(i)); //colour based on the data
        });
    });
}