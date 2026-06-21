import { FiLogIn } from "react-icons/fi";
import api from "../api";
export const fetchSolutions = async () => {
  try {
    const response = await api.get("solutions/");
    console.log("solutions fetched");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "error in fetching solutions",
    );
  }
};
