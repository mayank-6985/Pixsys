import api from "../api";

export const fetchNews = async () => {
  try {
    const response = await api.get("news/");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch news data.",
    );
  }
};

export const fetchNewsById = async (id) => {
  try {
    const response = await api.get(`news/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch article details.",
    );
  }
};
