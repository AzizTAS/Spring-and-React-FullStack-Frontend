import React from "react";
import ReactDOM from "react-dom/client";
//import App from './App.jsx'
import { RouterProvider } from "react-router-dom";
import "./locales";
import router from "./router";
import "./styles.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
