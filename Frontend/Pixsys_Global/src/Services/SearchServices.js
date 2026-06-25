import api from "../api";

export const fetchGlobalSearch = async (keyword) => {
  if (!keyword || typeof keyword !== "string") {
    return {
      products: [],
      news: [],
      downloads: [],
      solutions: [],
    };
  }

  try {
    const response = await api.get(
      `search/global/?keyword=${encodeURIComponent(keyword)}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Search request failed");
  }
};
