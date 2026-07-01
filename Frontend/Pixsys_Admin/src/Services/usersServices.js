import api from "../../api";

export const getUsersData = async () => {
  try {
    const response = await api.get("customer/list/");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "user data not fetched ");
  }
};

export const getDownloadReportLink = async () => {
  try {
    const response = await api.get("customer/report/");
    return response.data.report_url;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "download link error  ");
  }
};
