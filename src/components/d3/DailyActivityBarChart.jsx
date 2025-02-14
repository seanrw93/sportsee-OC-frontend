import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getActivities } from '../../api/activity';
import * as d3 from 'd3';

/**
 * @typedef {Object} DailyActivityBarChartProps
 * @property {number} userId
 */

/**
 * @description A radar chart that displays the user's performance data
 * @param {DailyActivityBarChartProps} props
 * @returns {JSX.Element} The bar chart component
 */

const DailyActivityBarChart = ({ userId }) => {
    const svgRef = useRef(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const activityData = await getActivities(userId);
                if (activityData && activityData.data && activityData.data.sessions) {
                    setData(activityData.data.sessions);
                } else {
                    console.error("No activity data found. Data structure:", activityData);
                }
            } catch (error) {
                console.error("Failed to fetch activity data:", error);
            }
        };
        fetchActivities();
    }, [userId]);

    useEffect(() => {
        console.log('Rendering chart with data:', data); // Log data for visualization
        if (!Array.isArray(data) || !data.length) {
            console.warn('Data is not an array or is empty:', data); // Log a warning for empty or invalid data
            return; // Check if data is an array and not empty
        }

        // Create a tooltip div that is hidden by default
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("color", "#eee")
            .style("border", "1px solid #ccc")
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("box-shadow", "0 0 8px rgba(0, 0, 0, 0.1)");
        
        // Specify the chart’s dimensions.
        const container = svgRef.current.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = { top: 60, right: 50, bottom: 50, left: 30 };

        // Clear previous chart
        d3.select(svgRef.current).selectAll("*").remove();

        // Prepare the scales for positional and color encodings.
        const x0 = d3.scaleBand()
            .domain(data.map(d => d.day))
            .rangeRound([margin.top, width - margin.right])
            .paddingInner(0.6);

        const x1 = d3.scaleBand()
            .domain(["kilogram", "calories"])
            .rangeRound([0, x0.bandwidth()])
            .padding(0.5);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.kilogram, d.calories))]).nice()
            .rangeRound([height - margin.bottom, margin.top]);

        const color = d3.scaleOrdinal()
            .domain(["kilogram", "calories"])
            .range(["#E60000", "#020203"]);

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("style", "max-width: 100%; height: auto;");

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x0).tickSizeOuter(0))
            .call(g => g.selectAll(".domain").remove());

        svg.append("g")
            .attr("transform", `translate(${width - margin.right},0)`)
            .call(d3.axisRight(y).ticks(d3.max(y.domain()) / 100).tickSizeOuter(0))
            .call(g => {
                g.selectAll(".domain").remove();
                g.selectAll("line")
                    .attr("stroke", "#ccc")
                    .attr("x1", 0)
                    .attr("x2", -width + margin.right + margin.left)
                    .style("stroke-dasharray", "2,2"); 
            });

        svg.append("text")
            .attr("x", (width / 13))             
            .attr("y", margin.top / 1.5)
            .attr("text-anchor", "middle")  
            .style("font-size", "12px") 
            .style("font-weight", "bold")  
            .text("Daily Activity");

        const barGroups = svg.append("g")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("transform", d => `translate(${x0(d.day)},0)`);

        barGroups.selectAll("rect")
            .data(d => ["kilogram", "calories"].map(key => ({ key, value: d[key] })))
            .join("rect")
            .attr("x", d => x1(d.key))
            .attr("y", d => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", d => y(0) - y(d.value))
            .attr("rx", 0)
            .attr("ry", 0)
            .attr("style", "cursor: pointer;")
            .attr("fill", d => color(d.key))
            .on("mouseover", (_, d) => {
                tooltip.style("visibility", "visible")
                       .style("background-color", d.key === "kilogram" ? "#FF0101" : "#020203")
                       .text(`${d.key === "kilogram" ? d.value + " kg" : d.value + " kCal"}`);
            })
            .on("mousemove", event => {
                tooltip.style("top", `${event.pageY - 10}px`)
                       .style("left", `${event.pageX + 10}px`);
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden");
            });

;

        // Add legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width - margin.right - 280}, ${margin.top})`)

        legend.selectAll("rect")
            .data(["Weight (KG)", "Calories (KCal)"])
            .join("rect")
            .attr("x", (_, i) => i * 150 + 20)
            .attr("y", -30)
            .attr("rx", 20)
            .attr("ry", 20)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", d => color(d));

        legend.selectAll("text")
            .data(["Weight (kg)", "Burned calories (kCal)"])
            .join("text")
            .attr("x", (_, i) => i * 150 + 40)
            .attr("y", -24)
            .text(d => d)
            .attr("alignment-baseline", "middle")
            .style("font-size", "12px");

    }, [data]);

    return <svg ref={svgRef}></svg>;
};

DailyActivityBarChart.propTypes = {
    userId: PropTypes.number.isRequired,
};

export default DailyActivityBarChart;
