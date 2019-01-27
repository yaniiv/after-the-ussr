import {
  sovietCountryIsoCodes,
  colors,
  sovietLabelShift,
  netFsuMigrationOne,
  populationsIn1991
} from "./constants";

const sortedPopulationData = populationsIn1991.sort(function(a, b) {
  return d3.ascending(a.population, b.population);
});
export default class BarChart {
  constructor(opts) {
    // load in arguments from config object
    this.data = opts.data;
    this.sovietDataPoints = opts.data.filter(country =>
      sovietCountryIsoCodes.includes(country.id)
    );
    this.element = opts.element;
    // create the chart
    this.draw();
  }

  draw() {
    // define width, height and margin
    const scrollContainer = d3.select(".scroll");
    const boundingBox = scrollContainer.node().getBoundingClientRect();
    const { width } = boundingBox;

    this.barMargin = {
      top: 15,
      right: 175,
      bottom: 0,
      left: 60
    };

    this.width = width - this.barMargin.left - this.barMargin.right;
    this.height = width - this.barMargin.top - this.barMargin.bottom;

    this.plot = d3
      .select(".bar-graphic")
      .append("svg")
      .attr("width", this.width + this.barMargin.left + this.barMargin.right)
      .attr("height", this.height + this.barMargin.top + this.barMargin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.barMargin.left + "," + this.barMargin.top + ")"
      )
    // we'll actually be appending to a <g> element
    this.drawTitle();

    // create the other stuff
    this.setXScale(this.data);
    this.setYScale(this.data);
    
    this.bindDataToBars(sortedPopulationData);
    this.paintHiddenBars();
    this.addYAxes();

    this.hideAllElements();
  }

  hideAllElements() {
    this.plot.style("opacity", "0");
    this.textHeader.style("opacity", "0");
  }

  drawTitle() {
    const headerText = "FSU states 1991 population in millions"

    this.textHeader = d3.select(".bar-graphic-header")
    this.textHeader.text(headerText)
  }

  paintHiddenBars() {
    this.bars
      .append("rect")
      .attr("class", "bar")
      .attr("y", d => {
        return this.yScale(d.name);
      })
      .attr("height", () => this.yScale.rangeBand())
      .attr("fill", function(d, i) {
        return colors[i];
      })
  }

  setYScale(data) {
    this.xScale = d3.scale
      .linear()
      .range([0, this.width])
      .domain([
        0,
        d3.max(data, function(d) {
          return d.population;
        })
      ]);
  }

  setXScale(data) {
    this.yScale = d3.scale
      .ordinal()
      .rangeRoundBands([this.height, 0], 0.1)
      .domain(
        data.map(function(d) {
          return d.name;
        })
      );
  }

  addYAxes() {
    const yAxisStuff = d3.svg
      .axis()
      .scale(this.yScale)
      //no tick marks
      .tickSize(0)
      .orient("left");

    this.plot
      .append("g")
      .attr("class", "y-axis")
      .call(yAxisStuff);
  }

  redrawBarsAndLabels(data) {
    this.bindDataToBars(data);
    this.setXScale(data);
    this.setYScale(data);
    this.redrawBars(data);
    this.redrawLabels(data);
  }

  bindDataToBars(data) {
    this.bars = this.plot
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("g");
  }

  redrawBars() {
    d3.selectAll("rect")
      .transition()
      .delay(function(d, i) {
        return i * 100;
      })
      .attr("width", d => {
        console.warn("d for new width", d);
        return this.xScale(d.population);
      });
  }

  redrawLabels(data) {
    this.plot
      .selectAll(".label")
      .transition()
      .duration(500)
      .style("opacity", "0");

    this.plot
      .select("g")
      .selectAll(".text")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("y", d => {
        return this.yScale(d.name);
      })
      .attr("x", d => {
        return this.xScale(d.population) + 1;
      })
      .attr("dx", ".75em")
      .text(function(d) {
        return d.population;
      })
      .attr("transform", "translate(" + 0 + "," + this.barMargin.top + ")");
  }

  addPopulationLabels(data) {
    this.redrawLabels(data);

    this.plot
      .selectAll(".label")
      .style("opacity", "0")
      .transition()
      .delay(1500)
      .duration(1000)
      .style("opacity", "1");
  }

  revealBarChart() {
    this.plot
      .transition()
      .delay(1000)
      .duration(500)
      .style("opacity", "1");

    this.textHeader
      .transition()
      .delay(1000)
      .duration(500)
      .style("opacity", "1")
      .style("color", "black");
  }
}
