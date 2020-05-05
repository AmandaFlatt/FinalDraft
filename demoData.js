

// set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 30, left: 60}
    var width = 450 - margin.left - margin.right
    var  height = 450 - margin.top - margin.bottom;
  
    // append the svg object to the body of the page

   
var clearGraph = function()
                    {
                    d3.selectAll("#graph")
                        .remove();
                    }
    // Labels of row and columns

var initButtons = function(data)
{
    
    d3.select("#test")
    .on("click",function()
   
       { 
        clearGraph()
        var newdata= data.filter(function(d){
            
            if (d.country== "US")
            {
                return true;
            }
            else 
            {
                return false
            }
        })
        createBarGraph(newdata)
    })
     d3.select("#clear")
    .on("click",function()
    {
        clearGraph()
        CreateHeatMap(data)
       
    })
    
   
}
var setHeading = function(msg){
                d3.select("body")
                    .append("p")
                    .attr("id",msg)
                    .attr("class","header")
                    .text(msg)
        }
        setHeading("Test") 
        setHeading("clear")
 var createGroups = function(data){
        var myGroups = [data[0].country, data[2].country, data[4].country]
        return myGroups
}
var createVar= function(data){
        var myVar= [data[0].var,data[1].var]
        return myVar
    }
var createSVG = function()
{
     var svg = d3.select("#demoData")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("id","graph")
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    return svg
    
}
 var CreateHeatMap =function(demo){
    svg=createSVG()
    myGroups=createGroups(demo)
    console.log(myGroups)
    myVar=createVar(demo)
    console.log(myVar)
    // Build X scales and axis:
        var x = d3.scaleBand()
          .range([ 0, width ])
          .domain(myVar)
          .padding(0.01);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))

        // Build X scales and axis:
        var y = d3.scaleBand()
          .range([ height, 0 ])
          .domain(myGroups)
          .padding(0.01);
        svg.append("g")
          .call(d3.axisLeft(y));

        // Build color scale
        var myColor = d3.scaleLinear()
          .range(["white", "#69b3a2"])
          .domain([1,100])

    svg.selectAll()
      .data(demo, function(d) {return d.var+':'+d.country;})
      .enter()
      .append("rect")
      .attr("x", function(d) { console.log(d.var)
                              return x(d.var) })
      .attr("y", function(d) { console.log(d.country)
                              return y(d.country) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { console.log(d.value)
                                  return myColor(d.value)} )
     .on("mouseover", function(d)
                    {
                        
                        var xPosition = d3.event.pageX;
                        var yPosition = d3.event.pageY;
                        d3.select("#tooltip")
                            .style("left",xPosition + "px")
                            .style("top",yPosition +"px")
                            .append("p")
                            .text(d.value)
                        d3.select("#tooltip").classed("hidden",false);
                    })
        .on("mouseout",function(){
                    d3.selectAll("#tooltip p")
                            .remove();
                    d3.select("#tooltip").classed("hidden",true);}
                )
    

 }
 var createBarGraph=function(data)
{
    console.log(data)
     svg=createSVG()
     myVar=createVar(data)
      var x = d3.scaleBand()
          .range([ 0, width ])
          .domain(myVar)
          .padding(0.01);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
        var findY=function(data)
        {
           return d3.max(data.map(function(data)
                                  {return data.value;}))
        }
        maxY=findY(data)
        console.log("max",maxY)
        // Build X scales and axis:
        var y = d3.scaleLinear()
          .domain([0,maxY])
          .range([ height,0 ])
          
        svg.append("g")
          .call(d3.axisLeft(y));
     var ybarscale=d3.scaleLinear()
          .domain([0,maxY])
          .range([0, height ])
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x",function(data){
        console.log("x",data.var)
        console.log("scaled x",x(data.var))
        return x(data.var)
    })
        .attr("y",function(data){
        data=ybarscale(data.value)
        return height-data})
        .attr("width",function(){return width/2})
        .attr("height",function(data){
        console.log("sclaed y")
        return ybarscale(data.value)})
    
 }
var demoPromise = d3.json("demoData.json");

demoPromise.then(function(demo)
{
    console.log("data",demo);
   
   
    
    CreateHeatMap(demo)
   
    initButtons(demo)

    },
function(err)
{
   console.log("Error Loading data:",err);
});