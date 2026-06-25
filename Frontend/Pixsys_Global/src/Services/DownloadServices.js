export const fetchAllDownloads = async () => {
  try {
    const response = await api.get("downloads/");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Fetch downloads failed");
  }
};
