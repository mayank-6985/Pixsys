import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./Layouts/MainLayout";
import PageNotFound from "./components/PageNotFound";
import AppRouter from "./Index";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
