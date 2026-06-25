import api from "../api";

export const fetchProuctsForHeader = async () => {
  try {
    const response = await api.get("products/");
    console.log("products data fateched", response.data);

    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "fetch header data for header failed",
    );
  }
};
