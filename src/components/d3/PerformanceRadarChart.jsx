import { useState, useEffect, useRef } from 'react';
import { getPerformanceData } from '../../api/performance';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

/**
 * @typedef {Object} PerformanceRadarChartProps
 * @property {number} userId
 */

/**
 * @description A radar chart that displays the user's performance data
 * @param {PerformanceRadarChartProps} props
 * @returns {JSX.Element} The radar chart component
 */

const PerformanceRadarChart = ({ userId }) => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [kinds, setKinds] = useState({});

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const performanceData = await getPerformanceData(userId);
        if (performanceData && performanceData.data) {
          setData(performanceData.data.data);
          setKinds(performanceData.data.kind);
        } else {
          console.error("No performance data found. Data structure:", performanceData);
        }
      } catch (error) {
        console.error("Failed to fetch performance data:", error);
      }
    };
    fetchPerformanceData();
  }, [userId]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const levels = data.length - 1;

    const container = svgRef.current.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 25, right: 25, bottom: 25, left: 25 };
    const radius = Math.min(width, height) / 2 - Math.max(margin.top, margin.right, margin.bottom, margin.left);

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('border-radius', '5px')
      .style('background-color', '#282D30')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    svg.selectAll("*").remove(); // Clear previous content
    
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const angleSlice = (Math.PI * 2) / data.length;

    const maxValue = d3.max(data, d => d.value);

    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

    const radarLine = d3.lineRadial()
      .radius(d => rScale(d.value))
      .angle((_, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    // Function to create hexagonal paths
    const hexagon = (level) => {
        const points = [];
        for (let i = 0; i < 6; i++) {
          const angle = Math.PI / 3 * i;
          const r = (radius / levels) * level;
          points.push([r * Math.cos(angle), r * Math.sin(angle)]);
        }
        return points;
    };
  
      // Add hexagonal grid
    for (let level = 0; level < levels; level++) {
        g.append('polygon')
            .attr('points', hexagon(level + 1).map(d => d.join(',')).join(' '))
            .style('fill', 'none')
            .style('stroke', '#fff')
            .style('stroke-width', '0.5px')
            .style('transform', `rotate(30deg)`);
    };

    const axes = g.selectAll('.axis')
      .data(data)
      .enter().append('g')
      .attr('class', 'axis');

    axes.append('text')
      .attr('x', (_, i) => (rScale(maxValue * 1.1)) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (_, i) => (rScale(maxValue * 1.1)) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('fill', '#fff')
      .attr('text-anchor', 'middle')
      .text(d => kinds[d.kind].charAt(0).toUpperCase() + kinds[d.kind].slice(1)); 

    // Add radar line
    g.append('path')
      .datum(data)
      .attr('d', radarLine)
      .style('fill', '#FF0101')
      .style('fill-opacity', 0.7);

  }, [data, kinds]);

  return <svg ref={svgRef}></svg>;
};

PerformanceRadarChart.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default PerformanceRadarChart;
