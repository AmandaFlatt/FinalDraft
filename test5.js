var drawBoxes = function(distData,target,xScale,yScale){
var width=100
 d3.select(target)
    .selectAll("Vlines")
    .data(distData)
    .enter()
    .append("line")
        .attr("x1",function(data,i){return xScale(i)})
        .attr("y1", function(data){return yScale(data.min)})
        .attr("x2",function(data,i){return xScale(i)})
        .attr("y2",function(data){return yScale(data.max)})
        .attr("stroke","red")
        .style("width",30)
 d3.select(target)
    .selectAll("boxes")
    .data(distData)
    .enter()
    .append("rect")
        .attr("x",function(data,i){return xScale(i-width/2)})
        .attr("y",function(data){return yScale(data.topQ)})
        .attr("height", function(data){return yScale(data.topQ-data.bottomQ)})
        .attr("width",width)
        .attr("stroke","black")
        
        
}
drawBoxes(distData,target,xScale,yScale)