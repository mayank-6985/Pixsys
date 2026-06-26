import api from "../api";

export const fetchImagesforHome = async () => {
  const response = await api.get("home/");
  return response.data;
};
