import React, { useEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldIndiaLow from "@amcharts/amcharts5-geodata/worldIndiaLow";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const PacificMap = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const root = am5.Root.new(chartRef.current);
        root.setThemes([am5themes_Animated.new(root)]);

        const chart = root.container.children.push(
            am5map.MapChart.new(root, {
                panX: 'rotateX',
                panY: 'translateY',
                projection: am5map.geoMercator(),
                rotationX: -160
            })
        );

        const polygonSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_worldIndiaLow,
                exclude: ['AQ']
            })
        );

        polygonSeries.mapPolygons.template.setAll({
            tooltipText: '{name}',
            interactive: true,
            fill: am5.color(0x334155),
            stroke: am5.color(0x1e293b),
            strokeWidth: 0.8
        });

        polygonSeries.mapPolygons.template.states.create('hover', {
            fill: am5.color(0x3b82f6)
        });

        chart.appear(1000, 100);

        return () => {
            root.dispose();
        };
    }, []);

    return (
        <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '12px',
            boxSizing: 'border-box'
        }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
                🌏 Pacific-Centered Mercator Map
            </h4>
            <div
                ref={chartRef}
                style={{
                    width: '100%',
                    height: '240px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#020617'
                }}
            />
        </div>
    );
};

export default PacificMap;
