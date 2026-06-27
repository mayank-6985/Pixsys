import api from "../../api";

export const fetchQueryData = async () => {
  const response = await api.get("contactus/inquiries/");
  console.log(response.data);
  
  return response.data;
};
