import { useState } from "react";
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
