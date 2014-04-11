var data_arr = [];
draw_saving_bar_chart();

/* -------------------------------------------------------------------------    */
/**
 * This function is used to draw a simple bar chart using d3js.
 * 
 * @version     0.0.1
 * @returns     Plots a multi bar chart.
 */
function draw_saving_bar_chart() {
    $('.saving-bar-chart-wrapper svg').remove();
    var margin = {top: 20, right: 10, bottom: 20, left: 60},
    width = $('.saving-bar-chart-wrapper').width() - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;
    
    var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);
    
    var y = d3.scale.linear()
            .range([height, 0]);
    
    var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom");
          
    var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left")
                  .ticks(10)
                  .tickFormat(d3.format(".2s"));
          
    var svg = d3.select('.saving-bar-chart-wrapper').append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   // console.log($('#percent_select').val());
   // console.log($('#saving_percent').val());
    
    d3.tsv("assets/data/saving-bar-chart.tsv", type, function(error, data) {
        var savings = 0;
        if(data_arr.length != 4)
        {
            for(var i=0;i<=3;i++)
                data_arr.push(data[i]['frequency']);
            //console.log(data_arr);
            
        }
        else
        {
            if(parseInt($('#percent_select').val()) >= 0)
            {
                savings = (parseInt($('#saving_percent').val())/100)*parseInt(data_arr[$('#percent_select').val()]);
                console.log(parseInt($('#saving_percent').val()));
                console.log(parseInt(data_arr[$('#percent_select').val()]));
              } 
           //console.log(savings);
        }
        
        data[4]['frequency'] = savings ;
        
        x.domain(data.map(function(d) {
            return d.letter;
        }));
        y.domain([0, d3.max(data, function(d) {
                return d.frequency;
            })]);
        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
        svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Total Expenses");
        
        svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) {
                    return x(d.letter);
                })
                .attr("width", x.rangeBand())
                .attr("y", function(d) {
                    return y(d.frequency);
                })
                .attr("height", function(d) {
                    return height - y(d.frequency);
                })
                
         svg.selectAll(".text")
                .data(data)
                .enter().append("text")
                .attr("dy", ".75em")
                .attr("y", function(d){
                    return y(d.frequency) - 20;
                })
                .attr("x", function(d){
                    return x(d.letter) + x.rangeBand() / 2;
                })
                .attr("text-anchor", "middle")
                .text(function(d) { return d.frequency; })
                ;
        });
    function type(d) {
        d.frequency = +d.frequency;
        return d;
    }
}

/*  ------------------------------------------------------------------------    */
/**
 * This function is used to plot a stacked bar chart using d3js.
 * 
 * @version     0.0.1
 * @returns     Plots a stacked multi bar chart.
 */


$('#percent_submit').on('click',function(){
    draw_saving_bar_chart() ;
});