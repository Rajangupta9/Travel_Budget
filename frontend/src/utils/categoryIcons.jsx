import React from "react";
import { Coffee, Compass, Home, Briefcase, DollarSign } from "lucide-react";

export const getCategoryIcon = (category) => {
  switch (category) {
    case "Food":
      return <Coffee className="text-pink-500" />;
    case "Transport":
    case "Transportation":
      return <Compass className="text-purple-500" />;
    case "Accommodation":
      return <Home className="text-indigo-500" />;
    case "Activities":
      return <Briefcase className="text-orange-500" />;
    default:
      return <DollarSign className="text-teal-500" />;
  }
};