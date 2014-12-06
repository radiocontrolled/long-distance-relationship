
var height,
	width, 
	planetaryData,
	solarSystem;

var getViewportDimensions = function(){	
	/* check if viewing portrait or landscape ... */
	width = document.getElementById("planets");
	width = width.offsetWidth;
	width = width * 0.90;	
	height = width * 2;
};

getViewportDimensions();

d3.json("planets.json", function(error, data) {
	
  planetaryData = data; 
  
  visualise(planetaryData, height);

});

	
var setup = function(w,h) {
	solarSystem = d3.select("#planets")
		.append("svg")
		.attr("class", "axis")
		.attr({
			"width": w + "px",
			"height": h + "px"
		});
};

setup(width, height);

var visualise = function(planetaryData, height){
	
	// hold the range of distances to the sun
	var distances = [],
		radiuses = [];
		
	for(var key in planetaryData){
		if(planetaryData.hasOwnProperty(key)){
			distances.push(planetaryData[key]["Mean distance from Sun (AU)"]);
			radiuses.push(planetaryData[key]["Equatorial radius (KM)"]);	
		}
	}
		
	var distanceFromSunScale = d3.scale.linear()
		.domain([d3.min(distances),d3.max(distances)]) //input domain = min & max distances
		.range([10, height - (height *0.1)]); // output range = height of svg
	
	var radiusScale = d3.scale.linear()
		.domain([d3.min(radiuses),d3.max(radiuses)])
		.range([d3.min(radiuses)/3000,d3.max(radiuses)/3000]);
	
	var planets = solarSystem.selectAll("circle")
		.append("g")
		.attr("transform","translate(10,10)")
		.data(planetaryData)
		.enter()
		.append("circle")
		.attr({
			"r": function(d) {
				return radiusScale(d["Equatorial radius (KM)"]);
			},
			"cy": function(d){
				return distanceFromSunScale(d["Mean distance from Sun (AU)"]);
			},
			"cx": function(){
				return width/2;
			},
			"fill": "#ecf0f1"
			
		});
	
	var labels = solarSystem.selectAll("text")
		.data(planetaryData)
		.enter()
		
		.append("text")
		.text(function(d){
			return d["Planet"] + ", " + d["Mean distance from Sun (AU)"] + " au";
		})
		.attr({
			"x": function(){
				return (width/2) + 30;
			},
			"y": function(d){
				return  distanceFromSunScale(d["Mean distance from Sun (AU)"] );
			},
			"fill": "white",
			"text-anchor": "start"
		});

	

};

d3.select(window).on('resize', resize);

function resize(globe) {
	getViewportDimensions();
	
}


