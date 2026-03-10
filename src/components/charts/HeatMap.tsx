/**
 * D3-based heatmap component
 */

'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { COLORS } from '@/lib/constants';
import type { HeatmapCell } from '@/types';

interface HeatMapProps {
  data: HeatmapCell[];
  title?: string;
  width?: number;
  height?: number;
  colorScheme?: 'viridis' | 'blues' | 'greens';
}

export const HeatMap: React.FC<HeatMapProps> = ({
  data,
  title,
  width = 1000,
  height = 300,
  colorScheme = 'blues',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const cellSize = 15;
    const cellPadding = 2;
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Color scale
    const colorScales: Record<string, any> = {
      viridis: d3.scaleLinear<string>()
        .domain([0, d3.max(data, (d) => d.value) || 0])
        .range(['#0f172a', '#3b82f6']),
      blues: d3.scaleLinear<string>()
        .domain([0, d3.max(data, (d) => d.value) || 0])
        .range([COLORS.backgroundTertiary, COLORS.chart.blue]),
      greens: d3.scaleLinear<string>()
        .domain([0, d3.max(data, (d) => d.value) || 0])
        .range([COLORS.backgroundTertiary, COLORS.chart.green]),
    };

    const colorScale = colorScales[colorScheme] || colorScales.viridis;

    // Get unique days and hours
    const days = [...new Set(data.map((d) => d.day))];
    const hours = [...new Set(data.map((d) => d.hour))].sort((a, b) => a - b);

    const svgWidth = width;
    const svgHeight = height;

    // Create SVG group
    const g = svg
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X axis (hours)
    const xScale = d3
      .scaleBand()
      .domain(hours.map((h) => h.toString()))
      .range([0, hours.length * cellSize])
      .padding(0);

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${days.length * cellSize + cellPadding})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .style('color', COLORS.textTertiary)
      .style('font-size', '11px');

    // Y axis (days)
    const yScale = d3
      .scaleBand()
      .domain(days)
      .range([0, days.length * cellSize])
      .padding(0);

    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale).tickSize(0))
      .style('color', COLORS.textTertiary)
      .style('font-size', '11px');

    // Cells
    g.selectAll('.cell')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', (d) => (xScale(d.hour.toString()) || 0) + cellPadding)
      .attr('y', (d) => (yScale(d.day) || 0) + cellPadding)
      .attr('width', cellSize - cellPadding * 2)
      .attr('height', cellSize - cellPadding * 2)
      .style('fill', (d) => colorScale(d.value))
      .style('stroke', COLORS.border)
      .style('stroke-width', '0.5px')
      .on('mouseover', function (e, d) {
        d3.select(this).style('stroke', COLORS.chart.blue).style('stroke-width', '1.5px');
      })
      .on('mouseout', function () {
        d3.select(this).style('stroke', COLORS.border).style('stroke-width', '0.5px');
      });

    // Cleanup
    return () => {
      svg.selectAll('*').remove();
    };
  }, [data, width, height, colorScheme]);

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4 text-slate-200">{title}</h3>}
      <div className="overflow-x-auto">
        <svg ref={svgRef} />
      </div>
    </div>
  );
};
