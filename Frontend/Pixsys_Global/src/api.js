import axios from "axios";

const api = axios.create({
  //   baseURL: `${import.meta.VITE_API_URL}`,
  baseURL: "https://tragicomical-epileptically-davin.ngrok-free.dev/v1/api/",
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export default api;
