import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import TravelBudgetDashboard from "./components/TravelBudgetDashboard";
import Dashboard from "./pages/Dashboard";
import HomePage from "./components/HomePage";
import Expenses from "./pages/Expenses";
import TripPlanner from "./pages/TripPlanner";

// Auth checker component to monitor token status
const AuthChecker = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      // Only redirect if not already on Auth or Signup page
      if (!token && 
          location.pathname !== '/Auth' && 
          location.pathname !== '/') {
        navigate('/Auth');
      }
    };
    
    checkAuth();
    const interval = setInterval(checkAuth, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [navigate, location]);
  
  return children;
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('accessToken') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/Auth" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthChecker>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/Auth' element={<AuthPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard1" element={
            <ProtectedRoute>
              <TravelBudgetDashboard />
            </ProtectedRoute>
          } />
          <Route path="/expenses" element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          } />
          <Route path="/trip-planner" element={
            <ProtectedRoute>
              <TripPlanner />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthChecker>
    </BrowserRouter>
  );
}

export default App;