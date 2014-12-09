
/* 
 * by Alison Benjamin 
 * http://benj.info
 */

var height,
	width, 
	planetaryData,
	solarSystem,
	distanceFromSunScale,
	radiusScale,
	distances = [],
	radiuses = [],
	saturn,
	labels,
	planets,
	saturnRings,
	yAxis,
	svgAxis;

var getViewportDimensions = function(){	
	width = document.getElementById("planets").offsetWidth;	
	height = window.innerHeight * 5;
};

getViewportDimensions();


solarSystem = d3.selectAll("#planets")
	.append("svg")
	.attr({
		"class":"axis",
		"width": width + "px",
		"height": height + "px"
	});


d3.json("planets.json", function(error, data) {

  if(data) {
  	
 	 planetaryData = data; 
 	 
 	 visualise(planetaryData, height); 	
  
  }
  
  else if(error) {
  	
  	console.log(error);
  
  }
 

});

	

var visualise = function(planetaryData, height){
		
	// populate distances & radiuses array and saturn var to be used in saturnRings function	
	for(var key in planetaryData){
		if(planetaryData.hasOwnProperty(key)){
			distances.push(planetaryData[key]["Mean distance from Sun (AU)"]);
			radiuses.push(planetaryData[key]["Equatorial radius (KM)"]);
			if(planetaryData[key].Planet == "Saturn"){
				saturn = planetaryData[key];
			}
		}
	}
		
	distanceFromSunScale = d3.scale.linear()
		.domain([d3.min(distances),d3.max(distances)]) //input domain = min & max distances
		.range([0, height*0.95]); // output range = height of svg
	
	radiusScale = d3.scale.linear()
		.domain([d3.min(radiuses),d3.max(radiuses)])
		.range([d3.min(radiuses)/2000,d3.max(radiuses)/2000]);
	
	planets = solarSystem.selectAll("circle")
		.data(planetaryData)
		.enter()
		.append("g")
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
			"class": function(d){
				return d.Planet;
			}
			
		});
		
	labels = solarSystem.selectAll("text")
		.data(planetaryData)
		.enter()
		.append("g")
		.attr({
			"id": function(d){
				return d.Planet;
			},
			"transform": "translate(0,5)"
		})
		.append("text")
		.text(function(d){
			return d.Planet + ", " + d["Mean distance from Sun (AU)"];
		})
		.attr({
			"x": width,
			"y": function(d){
				return distanceFromSunScale(d["Mean distance from Sun (AU)"] );
			},
			"fill": "white",
			"text-anchor": "end"
		});

	/* add rings to saturn - use an SVG rectange with rounded corners to represent this*/
	saturnRings = d3.select("svg")
		.append("rect")
		.classed("saturnRings",true)
		.attr({
			"x": function(){
				return (width/2) - ((radiusScale(saturn["Equatorial radius (KM)"]) * 1.75  )   );
			},
			"y": function(){
				return distanceFromSunScale(saturn["Mean distance from Sun (AU)"]);
			},
			"rx":20, 
			"ry":20,
			"fill":"#ecf0f1",
			"height":5,
			"width": function(){
				 return radiusScale(saturn["Equatorial radius (KM)"]) * 3.5 ;
			}
			
		});	
		
	// define y axis 
	yAxis = d3.svg.axis()
		.scale(distanceFromSunScale)
		.orient("right")
		.ticks(30);

	// create y axis
	svgAxis = d3.select("svg")
		.append("g")
    	.attr({
    		"class": "svgAxis",
    		"transform":"translate(0,-0.5)"
    	})
    	.call(yAxis);
    
    // label the y axis
    var yAxisLabel = d3.select("svg")
    	.append("g")
    	.attr({
    		"class":"axisLabel",
    		"transform":"rotate(270, 15,3)",
    		"x": 0, 
    		"y":0
    	})
    	.append("text")
    	.text("au");
    	

   
};



d3.select(window).on('resize', resize);

function resize() {
	
	// update canvas size
	getViewportDimensions();
	d3.select("svg")
		.attr({
			"width": width + "px",
			"height": height + "px"
		});


	// update distance scale
	distanceFromSunScale.range([0, height*0.95]); 
	
	// update planet size scale 
	radiusScale.range([d3.min(radiuses)/2000,d3.max(radiuses)/2000]);
	
	// update the position of the planets 
	planets
		.attr({
			"r": function(d) {
				return radiusScale(d["Equatorial radius (KM)"]);
			},
			"cy": function(d){
				return distanceFromSunScale(d["Mean distance from Sun (AU)"]);
			},
			"cx": function(){
				return width/2;
			}
			
		});
		
	// update the "rings" around Saturn 
	saturnRings
		.attr({
			"x": function(){
				return (width/2) - ((radiusScale(saturn["Equatorial radius (KM)"]) * 1.75  )   );
			},
			"y": function(){
				return distanceFromSunScale(saturn["Mean distance from Sun (AU)"]);
			},
			"width": function(){
				 return radiusScale(saturn["Equatorial radius (KM)"]) * 3.5 ;
			}
			
		});	
	
	// update the position of the labels
	labels
		.attr({
			"x": width,
			"y": function(d){
				return distanceFromSunScale(d["Mean distance from Sun (AU)"] );
			}
		});
		
	// update y axis scale
	yAxis.scale(distanceFromSunScale);
	svgAxis.call(yAxis);

	
}


