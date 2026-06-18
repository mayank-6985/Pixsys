import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AdminLayout from "../Layout/AdminLayout";
import Home from "../Pages/Home";
import News from "../Pages/News";
import Products from "../Pages/Products";
import Solutions from "../Pages/Solutions";
import Download from "../Pages/Download"

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/solutions",
        element: <Solutions />,
      },
      {
        path: "/news",
        element: <News />,
      },
      {
        path: "/download",
        element: <Download />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
