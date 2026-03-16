import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";


import About from "./about.jsx";
import ContactPage from "./contact.jsx";
import Demo from "./demo.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<App />} />
        <Route path="/about"   element={<About />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/demo"    element={<Demo />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
