import { useState,useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./Layouts/MainLayout";
import PageNotFound from "./components/PageNotFound";
import AppRouter from "./Index";
import api from "./api";
import { MdAnalytics } from "react-icons/md";
function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    api
      .post("analytics/track/")
      .catch((err) => console.error("Analytics tracking failed", err));
  }, []);

  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
