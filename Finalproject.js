var margin = {top: 30, right: 10, bottom: 10, left: 0}
var width = 500 - margin.left - margin.right
var height = 400 - margin.top - margin.bottom
var clearGraph = function()
                    {
                    d3.selectAll("#ParralCord")
                        .remove();
                    }
var createParCord = function(data){
    // append the svg object to the body of the page
    var svg = d3.select("#myGraph")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
        .attr("id","ParralCord")
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
     // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
    var dimensions = d3.keys(data[0]).filter(function(d) { return d != "country" })
    console.log(dimensions)
    var y = {}
    var createYscale1= function (data,dim){
      y[dim] = d3.scaleLinear()
      .domain( d3.extent(data, function(d) {
        return +d[dim]; }) )
      .range([height,0])
      return y[dim]
  } 
    var createYscale2= function (data,dim){
      y[dim] = d3.scaleLinear()
      .domain( d3.extent(data, function(d) {
        return +d[dim]; }) )
      .range([0,height])
      return y[dim]
  }     
    var x = d3.scalePoint()
        .range([0, width])
        .padding(1)
        .domain(dimensions);
    createYscale1(data,"Poverty")

    createYscale1(data,"NoEducaiton")
    createYscale1(data,"NoSchool")
    createYscale2(data,"LittercyRates")
    createYscale1(data,"OutOfSchool")
    //  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
      return d3.line()(dimensions.map(function(p) { 
                                                   return [x(p), y[p](d[p])]}))}
  
  var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Draw the lines
  svg
    .selectAll("myPath")
    .data(data)
    .enter().append("path")
    .on("mouseover",function(data)
        {   
     
            if(! d3.select(this).classed("off"))
            {
            d3.selectAll(".line")
            .classed("fade",true);
            
            d3.select(this)
                .classed("fade",false)
                .raise(); //move to top
            }
        
                       


            var xPosition = d3.event.pageX;
            var yPosition = d3.event.pageY;
            d3.select("#tooltip")
                .style("left",xPosition + "px")
                .style("top",yPosition +"px")
                .select("#value")
                .text(data.country)




            d3.select("#tooltip").classed("hidden",false);

                    

            
        })
        .on("mouseout",function(data)
           {
            if(! d3.select(this).classed("off"))
            {
            
            d3.selectAll(".line")
                .classed("fade",false);
            }
                 d3.select("#tooltip #data")
                            .remove();
             d3.select("#tooltip").classed("hidden",true)
        })
   
    .attr("d",  path)
    .classed("line",true)
    .style("fill", "none")
    .style("stroke", function(data){return colorScale(data.country)})
    .attr("stroke-width",5)
    
    
    

  // Draw the axis:
  svg.selectAll("myAxis")
    
    .data(dimensions).enter()
    .append("g")
    
    .attr("class","axis")
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    
    .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
    // Add axis title
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black")
      .attr("stroke-width",5)
} 


 


 var initButtons = function(data)
{
    
    d3.select("#above")
    .on("click",function()
   
       { 
        clearGraph()
        var newdata= data.filter(function(d){
            
            if (d.Poverty <= 15)
            {
                return true;
            }
            else 
            {
                return false
            }
        })
        createParCord(newdata)
    })
     d3.select("#below")
    .on("click",function()
   
       { 
        clearGraph()
        var newdata= data.filter(function(d){
            
            if (d.Poverty > 15)
            {
                console.log("false",d.Poverty)
                return true;
            }
            else 
            {
                return false
            }
        })
        console.log(newdata)
        createParCord(newdata)
    })
     d3.select("#clear")
    .on("click",function()
    {
        clearGraph()
        createParCord(data)
       
    })
    
   
}
  


    
   



var dataPromise = d3.json("FinalData.json");

dataPromise.then(function(data)
{
    console.log("data",data);
   
    createParCord(data)
    initButtons(data)


 



   



    
}

,


    
   
    
function(err)
{
   console.log("Error Loading data:",err);
});

