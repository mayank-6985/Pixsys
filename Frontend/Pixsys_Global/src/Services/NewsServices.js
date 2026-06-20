import api from "../api";

export const fetchNews = async () => {
  try {
    const response = await api.get("news/");
    console.log("news fetched ", response.data);
    return response.data
  } catch (error) {
    console.log("error fetching news");
    
    throw new Error(
      error?.response?.data?.message || "Failed to fetch news data.",
    );
  }
};
