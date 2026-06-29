import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useVisitorAnalytics } from "../hooks/useVisitorAnalytics";

const VisitorMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geoJsonLayerRef = useRef(null);

  const [viewMode, setViewMode] = useState("world");
  const { data, geoData, loading, error } = useVisitorAnalytics(viewMode);

  const getColor = (count) => {
    return count > 500
      ? "#b91c1c"
      : count > 200
        ? "#dc2626"
        : count > 50
          ? "#f87171"
          : count > 0
            ? "#fca5a5"
            : "#f1f5f9";
  };

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([20.0, 0.0], 2);
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      ).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!geoData || !mapInstanceRef.current || !data || data.length === 0)
      return;

    if (geoJsonLayerRef.current) {
      mapInstanceRef.current.removeLayer(geoJsonLayerRef.current);
    }
    const getFeatureData = (feature) => {
      const p = feature.properties;
      const regionName =
        p.ST_NM || p.st_nm || p.NAME_1 || p.name || p.NAME || "Unknown";
      const featureName =
        p.ST_NM || p.st_nm || p.state_name || p.NAME_1 || p.name || p.NAME;

      if (!featureName) return 0;

      const match = data.find((d) => {
        const apiName = viewMode === "india" ? d.state_name : d.country_name;
        return (
          apiName &&
          apiName.toLowerCase().trim() === featureName.toLowerCase().trim()
        );
      });

      return match ? match.count : 0;
    };
    geoJsonLayerRef.current = L.geoJSON(geoData, {
      style: (feature) => {
        const count = getFeatureData(feature);
        return {
          fillColor: getColor(count),
          weight: 1,
          opacity: 1,
          color: "#cbd5e1",
          fillOpacity: count > 0 ? 0.9 : 0.4,
        };
      },

      onEachFeature: (feature, layer) => {
        const count = getFeatureData(feature);
        const p = feature.properties;
        const regionName =
          p.ST_NM || p.st_nm || p.NAME_1 || p.name || p.NAME || "Unknown";

        if (count > 0) {
          layer.bindTooltip(
            `<div style="text-align: center; font-family: inherit;">
        <div style="font-size: 11px; font-weight: bold; color: #1a1a1a;">${regionName}</div>
        <div style="font-size: 13px; color: #b91c1c; font-weight: bold;">Visitors: ${count}</div>
      </div>`,
            {
              permanent: false,
              sticky: true,
              className: "custom-map-label",
            },
          );

          layer.on({
            mouseover: (e) => {
              const targetLayer = e.target;
              targetLayer.setStyle({
                weight: 2,
                color: "#1a1a1a",
                fillOpacity: 1,
              });
              targetLayer.bringToFront();
            },
            mouseout: (e) => {
              geoJsonLayerRef.current.resetStyle(e.target);
            },
            click: () => {
              if (
                viewMode === "world" &&
                regionName.toLowerCase() === "india"
              ) {
                setViewMode("india");
              }
            },
          });
        } else {
          layer.on({
            click: () => {
              if (
                viewMode === "world" &&
                regionName.toLowerCase() === "india"
              ) {
                setViewMode("india");
              }
            },
          });
        }
      },
    }).addTo(mapInstanceRef.current);

    if (geoJsonLayerRef.current.getBounds().isValid()) {
      mapInstanceRef.current.fitBounds(geoJsonLayerRef.current.getBounds(), {
        padding: [20, 20],
      });
    }
  }, [data, geoData, viewMode]);
  return (
    <div className="bg-white flex flex-col font-sans mb-6 border border-[#e5e7eb]">
      <style>{`
        .leaflet-tooltip.custom-map-label {
          background-color: rgba(255, 255, 255, 0.98);
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          border-radius: 6px;
          padding: 6px 10px;
        }
        /* Keep the little pointer arrow on the hover tooltip */
        .leaflet-tooltip.custom-map-label::before {
          border-top-color: rgba(255, 255, 255, 0.98);
        }
      `}</style>

      <div className="bg-[#1a1a1a] text-white px-5 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-between">
        <span>
          {viewMode === "world" ? "Global Visitor Map" : "India Visitor Map"}
        </span>
        {viewMode === "india" && (
          <button
            onClick={() => setViewMode("world")}
            className="bg-transparent border border-white text-white px-4 py-1.5 text-xs hover:bg-white hover:text-[#1a1a1a] transition-colors rounded-sm"
          >
            Back to Global
          </button>
        )}
      </div>

      <div className="p-5">
        {loading && (
          <p className="text-sm text-[#4b5563] mb-3 font-semibold">
            Loading map data...
          </p>
        )}
        {error && (
          <p className="text-sm text-[#dc2626] mb-3 font-semibold">
            Error: {error}
          </p>
        )}

        <div
          ref={mapRef}
          className="h-[520px] w-full z-0 relative border border-[#e5e7eb] rounded-sm overflow-hidden"
        />
      </div>
    </div>
  );
};

export default VisitorMap;
