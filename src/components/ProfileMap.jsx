import React, { useEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldIndiaLow from "@amcharts/amcharts5-geodata/worldIndiaLow";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const ProfileMap = () => {
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
                rotationX: -160,
                homeZoomLevel: 1.1,
                // panX: "none",
                // panY: "none",
                wheelX: "none",
                wheelY: "none",
                pinchZoom: false
            })
        );

        const polygonSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_worldIndiaLow,
                exclude: ['AQ']
            })
        );

        polygonSeries.mapPolygons.template.setAll({
            interactive: false,
            fill: am5.color(0x23282e),
            stroke: am5.color(0x15181c),
            strokeWidth: 0.5
        });

        polygonSeries.mapPolygons.template.adapters.add("fill", function (fill, target) {
            if (target.dataItem) {
                const id = target.dataItem.get("id");
                if (id === "IN") return am5.color(0xb5ff00);
                if (id === "VN") return am5.color(0x06b6d4);
                if (id === "TH") return am5.color(0x22c55e);
                if (id === "ID") return am5.color(0xa855f7);
                if (id === "NP") return am5.color(0x38bdf8);
                if (id === "MY") return am5.color(0x10b981);
            }
            return fill;
        });
        root._logo.dispose();
        chart.appear(800, 100);

        return () => {
            root.dispose();
        };
    }, []);

    return (
        <div
            ref={chartRef}
            style={{
                width: '100%',
                height: '145px',
                borderRadius: '20px',
                overflow: 'hidden',
                background: '#15191d'
            }}
        />
    );
};

export default ProfileMap;
