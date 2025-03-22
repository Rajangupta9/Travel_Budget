import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import Signup from "./components/Signup";
import TravelBudgetDashboard from "./components/TravelBudgetDashboard";
import Dashboard from "./pages/Dashboard";
import HomePage from "./components/HomePage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/Auth' element={<AuthPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard1" element={<Dashboard />} />
        <Route path="/dashboard" element={<TravelBudgetDashboard />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
