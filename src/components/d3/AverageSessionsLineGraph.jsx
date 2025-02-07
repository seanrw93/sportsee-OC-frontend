import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getAverageSessions } from '../../api/averageSessions';
import * as d3 from 'd3';

const AverageSessionsLineGraph = ({ userId }) => {
    const svgRef = useRef(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchAverageSessions = async () => {
            try {
                const averageSessionsData = await getAverageSessions(userId);
                if (averageSessionsData && averageSessionsData.data && averageSessionsData.data.sessions) {
                    setData(averageSessionsData.data.sessions);
                } else {
                    console.error("No average sessions data found. Data structure:", averageSessionsData);
                }
            } catch (error) {
                console.error("Failed to fetch average sessions data:", error);
            }
        };
        fetchAverageSessions();
    }, [userId]);

    useEffect(() => {
        if (data.length === 0) return;

        // Create a tooltip div that is hidden by default
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "#fbfbfb")
            .style("color", "#333")
            .style("border", "1px solid #ccc")
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("box-shadow", "0 0 8px rgba(0, 0, 0, 0.1)");

        const container = svgRef.current.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = { top: 40, right: 10, bottom: 40, left: 10 };

        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.day))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.sessionLength)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const line = d3.line()
            .x(d => x(d.day))
            .y(d => y(d.sessionLength))
            .curve(d3.curveBasis); // Apply curve

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("style", "max-width: 100%; height: auto;");

        svg.selectAll("*").remove(); // Clear previous content

        // Append the line path
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#fbfbfb")
            .attr("stroke-width", 1.5)
            .style("border-radius", "5px")
            .attr("d", line);

        // Append x-axis values as text elements
        svg.selectAll(".x-axis-text")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "x-axis-text")
            .attr("x", d => x(d.day))
            .attr("y", height - margin.bottom + 20) // Position below the graph
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "#fbfbfb")
            .text(d => d.day);

        // Append y-axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(d3.max(y.domain()) / 100).tickSizeOuter(0))
            .call(g => g.selectAll(".domain").remove());

        svg.append("text")
            .attr("x", (width - 150))             
            .attr("y", margin.top / 1.5)
            .attr("text-anchor", "middle")  
            .style("font-size", "12px") 
            .style("font-weight", "bold") 
            .style("fill", "#fbfbfb") 
            .text("Average speed");

        svg.append("text")
            .attr("x", (width - 146))             
            .attr("y", margin.top / 0.9)
            .attr("text-anchor", "middle")  
            .style("font-size", "12px") 
            .style("font-weight", "bold")
            .style("fill", "#fbfbfb") 
            .text("of your sessions");

        // Add circles for each data point
        svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("mouseover", () => tooltip.style("visibility", "visible"))
        .on("mousemove", event => {
            const [mouseX] = d3.pointer(event);
            const x0 = x.invert(mouseX);
            const bisect = d3.bisector(d => d.day).left;
            const i = bisect(data, x0, 1);
            const d0 = data[i - 1];
            const d1 = data[i];
            const d = x0 - d0.day > d1.day - x0 ? d1 : d0;

            // Interpolate the y-value
            const interpolatedY = d3.interpolateNumber(d0.sessionLength, d1.sessionLength)((x0 - d0.day) / (d1.day - d0.day));

            tooltip.style("top", `${event.pageY - 10}px`)
                .style("left", `${event.pageX + 10}px`)
                .text(`${Math.round(interpolatedY)} mins`);
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));

    }, [data]);

    return (
        <svg ref={svgRef}></svg>
    );
};

AverageSessionsLineGraph.propTypes = {
    userId: PropTypes.number.isRequired,
};

export default AverageSessionsLineGraph;