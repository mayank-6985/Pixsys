import { useState, useEffect } from "react";
import { visitorService } from "../services/visitorService";

export const useVisitorAnalytics = (viewMode) => {
  const [data, setData] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      setLoading(true);
      setError(null);

      try {
        const url =
          viewMode === "world"
            ? "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
            : "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson";

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to load map boundaries");

        const json = await response.json();
        setGeoData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGeoJSON();
  }, [viewMode]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setError(null);

      try {
        const responseData =
          viewMode === "world"
            ? await visitorService.getWorldData()
            : await visitorService.getIndiaData();
        setData(responseData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchAnalytics();
  }, [viewMode]);

  return { data, geoData, loading, error };
};
