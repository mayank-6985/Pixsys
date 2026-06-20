import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/v1/api/`,
  // baseURL: "https://tragicomical-epileptically-davin.ngrok-free.dev/v1/api/",
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export default api;
