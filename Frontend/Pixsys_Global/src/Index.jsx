import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Links,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import Home from "./pages/Home";
import PageNotFound from "./components/PageNotFound";
import Products from "./pages/Products";
import Solutions from "./pages/Solutions";
import About from "./pages/About";
import News from "./pages/News";
import Download from "./pages/Download";
import NewsDetail from "./pages/NewsDetail";
import Search from "./pages/Search";

const rootErrorBoundary = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <PageNotFound />;
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-900 p-8">
      <h1 className="text-2xl font-bold mb-4">Component Crash Detected!</h1>
      <pre className="bg-white p-4 border border-red-200 rounded shadow-sm">
        {error.message || JSON.stringify(error)}
      </pre>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <rootErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: "/products", element: <Products /> },
      { path: "/solutions", element: <Solutions /> },
      { path: "/about", element: <About /> },
      { path: "/news", element: <News /> },
      { path: "/news/:id", element: <NewsDetail /> },
      { path: "/download", element: <Download /> },
      { path: "/search", element: <Search /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
