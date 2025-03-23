import React from "react";

const BudgetCard = ({ title, value, subtitle, icon }) => {
  // Format the value if it's a number to ensure proper display
  const formattedValue = typeof value === 'number' && !isNaN(value) 
    ? value.toLocaleString() 
    : value;
  
  // Determine if subtitle is positive or negative to show appropriate colors
  const isPositiveSubtitle = subtitle.text && 
    (subtitle.text.includes("remaining") || subtitle.text.includes("Target"));
  
  const defaultSubtitleClass = isPositiveSubtitle 
    ? "text-sm text-emerald-600 font-medium" 
    : "text-sm text-gray-500";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="p-2 rounded-full bg-gray-50">
          {icon}
        </div>
      </div>
      
      <p className="text-3xl font-bold text-gray-800 mb-2">{formattedValue}</p>
      
      <div className="flex items-center mt-1">
        <span className={subtitle.className || defaultSubtitleClass}>
          {subtitle.text}
        </span>
      </div>
    </div>
  );
};

export default BudgetCard;