import api from "../api";

export const about = async (data) => {
  try {
    const response = await api.post("contactus/inquiries/", data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "error in about api");
  }
};
