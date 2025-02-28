import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

/**
 * @typedef {Object} TodayScoreRingChartProps
 * @property {number} score - The score to display
 */

/**
 * @description A ring chart that displays the user"s score for the day
 * @param {TodayScoreRingChartProps} props
 * @returns {JSX.Element} The ring chart component
 */
const TodayScoreRingChart = ({ score }) => {
    const svgRef = useRef(null);

    // Render the D3 chart when the score changes
    useEffect(() => {
        if (!score) return;

        // Get the dimensions of the container
        const container = svgRef.current.parentElement;
        const svg = d3.select(svgRef.current);
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = 40;
        const radius = Math.min(width, height) / 2 - margin;

        // Clear any previous content before drawing
        svg.selectAll("*").remove();

        svg.attr("width", width).attr("height", height);

        // Append a group element to center the chart
        const g = svg.append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        // Define the color scale
        const color = d3.scaleOrdinal()
            .domain([0, 100])
            .range(["#FF0101", "#D4D4D4"]);

        // Define the pie layout
        const pie = d3.pie()
            .value(d => d.value)
            .startAngle(2 * Math.PI)
            .endAngle(0)
            .sort(null);

        // Scale the score to a percentage value (0 to 100)
        const data = [
            { name: "score", value: score * 100 },
            { name: "remaining", value: 100 - (score * 100) }
        ];

        // Define the arc generator
        const arc = d3.arc()
            .innerRadius(radius * 0.85)
            .outerRadius(radius);

        // Append the arcs
        g.selectAll("path")
            .data(pie(data))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.name))
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        // Add the main score label
        svg.append("text")
            .attr("x", (width / 8))             
            .attr("y", 25)
            .attr("text-anchor", "middle")
            .attr("class", "score-label")  
            .style("font-size", "12px") 
            .style("font-weight", "bold")  
            .text("Score");

        // Add the score value text
        g.append("text")
            .attr("text-anchor", "middle")
            .attr("class", "score-value")
            .attr("dy", "-0.3em")
            .style("font-size", "24px")
            .style("font-weight", "bold")
            .style("fill", "#000")
            .text(`${score * 100}%`);

        // Add the secondary label text
        g.append("text")
            .attr("text-anchor", "middle")
            .attr("class", "score-label")
            .attr("dy", "0.8em")
            .style("font-size", "12px")
            .style("fill", "#000")
            .text("of your goal");

    }, [score]);

    return <svg ref={svgRef}></svg>;
};

TodayScoreRingChart.propTypes = {
    score: PropTypes.number.isRequired,
};

export default TodayScoreRingChart;