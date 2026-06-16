import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Links,
} from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import Home from "./pages/Home";
import PageNotFound from "./components/PageNotFound";
import Products from "./pages/Products";
import Solutions from "./pages/Solutions";
import About from "./pages/About";
import News from "./pages/News";
import Download from "./pages/Download";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <PageNotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "/products", element: <Products /> },
      { path: "/solutions", element: <Solutions /> },
      { path: "/about", element: <About /> },
      { path: "/news", element: <News /> },
      {path:"/download", element:<Download/>
      }
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
