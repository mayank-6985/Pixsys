import api from "../../api";
export const visitorService = {
  getWorldData: async () => {
    const response = await api.get(`analytics/map/world/`);
    return response.data;
  },

  getIndiaData: async () => {
    const response = await api.get("analytics/map/india/");
    return response.data;
  },
};
