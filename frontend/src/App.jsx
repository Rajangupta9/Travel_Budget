import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import Signup from "./components/Signup";
import TravelBudgetDashboard from "./components/TravelBudgetDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<TravelBudgetDashboard />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
