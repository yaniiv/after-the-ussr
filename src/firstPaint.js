import d3 from 'd3';

export default function firstPaint () {
  // Setup sizes for the graphic and steps
  const fullPageHeight = Math.floor(window.innerHeight);

  const halfPageHeight = Math.floor(window.innerHeight/2)
  const halfPageWidth = Math.floor(window.innerWidth/2)

  const quarterPageHeight = Math.floor(window.innerHeight * 0.25);

  d3.selectAll(".step")
    .style("height", fullPageHeight + "px");
  
// scroll graphic is world map container
  d3.select(".map-graphic-container")
    .style("width", halfPageWidth + "px")
    .style("height", halfPageHeight + "px")
    .style("top", quarterPageHeight + "px")
    .style("max-width", 400 + "px");

  d3.select(".bar-graphic-container")
    .style('top', halfPageHeight + 'px')
    .style("width", halfPageWidth + "px")
    .style("height", halfPageHeight + "px")
    .style("max-width", 400 + "px")

  if (window.innerWidth > 992) {
    d3.select(".bar-graphic-container")
      .style('top', quarterPageHeight + 'px')
  }

  // Use this to set the distance of the first step
  d3.select(".splash-container")
    .style("height", fullPageHeight + "px");

} 