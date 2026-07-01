import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AdminLayout from "../Layout/AdminLayout";
import Home from "../Pages/Home";
import News from "../Pages/News";
import Products from "../Pages/Products";
import Solutions from "../Pages/Solutions";
import Download from "../Pages/Download";
import Login from "../Pages/Login";
import SomethingWentWrong from "../Components/SomethingWentWrong";
import ContactQuery from "../Pages/ConactQuery";
import VisitorMap from "../Pages/VisitorMap";
import Users from "../Pages/Users";

import { ProtectedRoute, GuestRoute } from "../Components/AuthGuards";

const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    errorElement: <SomethingWentWrong />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    errorElement: <SomethingWentWrong />,
    children: [
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
          {
            path: "/conactquery",
            element: <ContactQuery />,
          },
          {
            path: "/visitor-map",
            element: <VisitorMap />,
          },
          {
            path: "/users",
            element: <Users />,
          },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
