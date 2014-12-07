
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

  if(data){
  	
 	 planetaryData = data; 
 	 
 	 visualise(planetaryData, height); 	
  
  }
  
  else if(error){
  	
  	console.log(error);
  
  }
 

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
		radiuses = [], 
		saturn;
		
	for(var key in planetaryData){
		if(planetaryData.hasOwnProperty(key)){
			distances.push(planetaryData[key]["Mean distance from Sun (AU)"]);
			radiuses.push(planetaryData[key]["Equatorial radius (KM)"]);
			if(planetaryData[key].Planet == "Saturn"){
				saturn = planetaryData[key];
			}
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
			"fill": "#ecf0f1",
			"id": function(d){
				return d.Planet;
			}
			
		});
		
	
	
	var labels = solarSystem.selectAll("text")
		.data(planetaryData)
		.enter()
		.append("text")
		.text(function(d){
			return d.Planet + ", " + d["Mean distance from Sun (AU)"] + " au";
		})
		.attr({
			"x": function(){
				return (width/2) + 50;
			},
			"y": function(d){
				return distanceFromSunScale(d["Mean distance from Sun (AU)"] );
			},
			"fill": "white",
			"text-anchor": "start"
		});


	/* add rings to saturn - use a rect with rounded corners to represent this*/
	var saturnRings = d3.select("svg")
		.append("rect")
		.attr({
			"x": function(){
				return (width/2) - ((radiusScale(saturn["Equatorial radius (KM)"]) * 2  )   );
			},
			"y": function(){
				return distanceFromSunScale(saturn["Mean distance from Sun (AU)"]);
			},
			"rx":20, 
			"ry":20,
			"fill":"#ecf0f1",
			"height":5,
			"width": function(){
				 return radiusScale(saturn["Equatorial radius (KM)"]) * 4 ;
			}
			
		});	
};

d3.select(window).on('resize', resize);

function resize() {
	getViewportDimensions();
	
}


