import React from "react";
//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Routes, Route, HashRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; 
import LoginPage from "./pages/Login/LoginPage";
import AdminLayout from "./layouts/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";

import { LoadingProvider  } from "./context/LoadingContext"; 
import  TopStrip   from "./components/TopStrip"; 

function App() {
  return (
    <LoadingProvider>
    <TopStrip />
    <ThemeProvider>
      <HashRouter>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<LoginPage />} /> 
          {/* Protected routes inside AdminLayout */}
          <Route path="/*" element={<AdminLayout />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
    </LoadingProvider>
  );
}

export default App;
