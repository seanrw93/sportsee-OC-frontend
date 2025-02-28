import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getAverageSessions } from '../../api/averageSessions';
import * as d3 from 'd3';

/**
 * @typedef {Object} AverageSessionsLineGraphProps
 * @property {number} userId
 */

/**
 * @description A line graph that displays the user's average session length
 * @param {AverageSessionsLineGraphProps} props
 * @returns {JSX.Element} The line graph component
 */
const AverageSessionsLineGraph = ({ userId }) => {
    const svgRef = useRef(null);
    const [data, setData] = useState([]);

    // Fetch average sessions data when the component mounts or userId changes
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

    // Render the D3 chart when data changes
    useEffect(() => {
        if (!Array.isArray(data) || !data) {
            console.warn("Data is not an array or is empty:", data);
            return; 
        }

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

        // Get the dimensions of the container
        const container = svgRef.current.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = { top: 40, right: 5, bottom: 40, left: 5 };

        // Create scales for x and y axes
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.day))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.sessionLength)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Create a line generator
        const line = d3.line()
            .x(d => x(d.day))
            .y(d => y(d.sessionLength))
            .curve(d3.curveBasis);

        // Append SVG element
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("style", "max-width: 100%; height: auto;");

        // Clear previous SVG content
        svg.selectAll("*").remove();

        // Append defs element for gradient
        const defs = svg.append("defs");

        // Create a gradient for the line
        const gradient = defs.append("linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

        // Define gradient stops
        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#fbfbfb")
            .attr("stop-opacity", 0.4);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#fbfbfb")
            .attr("stop-opacity", 1);

        // Create a path for the line
        const path = svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "url(#gradient)")
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
            .attr("y", height - margin.bottom + 20)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "#fbfbfb")
            .text(d => d.day);

        // Append title text
        svg.append("text")
            .attr("x", (width - 195))
            .attr("y", margin.top / 1.5)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("fill", "#fbfbfb")
            .text("Average speed");

        svg.append("text")
            .attr("x", (width - 190))
            .attr("y", margin.top / 0.9)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("fill", "#fbfbfb")
            .text("of your sessions");

        // Add a circle that will follow the mouse along the line
        const mouseCircle = svg.append("circle")
            .attr("r", 5)
            .attr("fill", "#fbfbfb")
            .style("visibility", "hidden");

        // Add a rectangle for mouse tracking
        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("mouseover", () => {
                tooltip.style("visibility", "visible");
                mouseCircle.style("visibility", "visible");
            })
            .on("mousemove", event => {
                const [mouseX] = d3.pointer(event);
                const x0 = x.invert(mouseX);
                const bisect = d3.bisector(d => d.day).left;
                const i = bisect(data, x0, 1);
                const d0 = data[i - 1];
                const d1 = data[i];

                // Ensure d0 and d1 exist for interpolation
                if (d0 && d1) {
                    // Interpolate the x and y values to get the exact position on the line
                    const interpolatedX = d3.interpolateNumber(d0.day, d1.day)((x0 - d0.day) / (d1.day - d0.day));
                    const interpolatedY = d3.interpolateNumber(d0.sessionLength, d1.sessionLength)((x0 - d0.day) / (d1.day - d0.day));

                    // Move the circle to the interpolated position
                    mouseCircle.attr("cx", x(interpolatedX))
                        .attr("cy", y(interpolatedY));

                    // Update tooltip position and text
                    tooltip.style("top", `${event.pageY - 10}px`)
                        .style("left", `${event.pageX + 10}px`)
                        .text(`${Math.round(interpolatedY)} mins`);
                }
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden");
                mouseCircle.style("visibility", "hidden");
            });

    }, [data]);

    return (
        <svg ref={svgRef}></svg>
    );
};

AverageSessionsLineGraph.propTypes = {
    userId: PropTypes.string.isRequired,
};

export default AverageSessionsLineGraph;