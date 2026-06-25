import { FiLogIn } from "react-icons/fi";
import api from "../api";
export const fetchSolutions = async () => {
  try {
    const response = await api.get("solutions/");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "error in fetching solutions",
    );
  }
};
