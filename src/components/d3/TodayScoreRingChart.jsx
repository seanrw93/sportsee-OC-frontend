import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const TodayScoreRingChart = ({ score }) => {
    const svgRef = useRef(null);

    useEffect(() => {

        if (!score) return;

        const container = svgRef.current.parentElement;
        const svg = d3.select(svgRef.current);
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = 40;
        const radius = Math.min(width, height) / 2 - margin;

        // Clear any previous content before drawing
        svg.selectAll("*").remove();

        svg.attr('width', width).attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const color = d3.scaleOrdinal()
            .domain([0, 100])
            .range(['#FF0101', '#D4D4D4']);

        const pie = d3.pie()
            .value(d => d.value)
            .startAngle(2 * Math.PI)
            .endAngle(0)
            .sort(null);

        // Scale the score to a percentage value (0 to 100)
        const data = [
            { name: 'score', value: score * 100 },
            { name: 'remaining', value: 100 - (score * 100) }
        ];

        const arc = d3.arc()
            .innerRadius(radius * 0.85)
            .outerRadius(radius);

        g.selectAll('path')
            .data(pie(data))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.name))
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        // Add the text label
        
        svg.append("text")
            .attr("x", (width / 8))             
            .attr("y", 25)
            .attr("text-anchor", "middle")
            .attr("class", "score-label")  
            .style("font-size", "12px") 
            .style("font-weight", "bold")  
            .text("Score");;

        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('class', 'score-value')
            .attr('dy', '-0.3em')
            .style('font-size', '24px')
            .style('font-weight', 'bold')
            .style('fill', '#000')
            .text(`${score * 100}%`)

        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('class', 'score-label')
            .attr('dy', '0.8em')
            .style('font-size', '12px')
            .style('fill', '#000')
            .text('of your goal')

    }, [score]);

    return <svg ref={svgRef}></svg>;
};

TodayScoreRingChart.propTypes = {
    score: PropTypes.number.isRequired,
}

export default TodayScoreRingChart;