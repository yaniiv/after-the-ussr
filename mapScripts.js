var sovietCountryIsoCodes = [ 'ARM', 'AZE', 'BLR', 'EST', 'GEO', 'KAZ', 'KGZ', 'LVA', 'LTU', 'MDA', 'RUS', 'TJK', 'TKM', 'UKR', 'UZB']
var rotate = -20;        // so that [-60, 0] becomes initial center of projection
var maxlat = 83;
var centered;

var mercatorBounds = function (projection, maxlat) {
  var yaw = projection.rotate()[0],
      xymax = projection([-yaw+180-1e-6,-maxlat]),
      xymin = projection([-yaw-180+1e-6, maxlat]);
  
  return [xymin,xymax];
}

var graphicContainer = d3.select(".scroll__graphic");
var graphicContainerSize = graphicContainer.node().getBoundingClientRect()
var width = graphicContainerSize.width
var height = graphicContainerSize.height

var projection = d3.geo.mercator()
  .rotate([rotate,0])
  .scale(1) // we'll scale up to match viewport shortly.
  .translate([width/2, height/2])
  // .center([0, 25])

// find the top left and bottom right of current projection
// set up the scale extent and initial scale for the projection
var b = mercatorBounds(projection, maxlat)
var s = width/(b[1][0]-b[0][0])
var scaleExtent = [s, 10*s];

projection.scale(scaleExtent[0]);

var path = d3.geo.path().projection(projection);

var worldGeoJson;
var svg

d3.json("world.json", function(json) {
  console.warn('loaded world.json:', json)

  worldGeoJson = json

  svg = d3
    .select(".scroll__graphic")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  var map = svg
    .append("g")
    .attr("id", "map");

  map
    .selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("stroke-width", 0.5 + "px")
    .attr("class", "country")
    .attr("id", function(d, i) {
      return "country" + d.properties.ISO_A3;
    })
    .attr('class', function(datapoint, i){
      if (sovietCountryIsoCodes.includes(datapoint.properties.ISO_A3)) {
        return "country soviet-country"
      } else {
        return "country non-soviet-country"
      }
    })
    
});

