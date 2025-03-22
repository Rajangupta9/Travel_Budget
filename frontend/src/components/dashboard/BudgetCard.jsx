import React from "react";

const BudgetCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <div className="flex items-center mt-1">
        <span className={subtitle.className || "text-sm text-gray-500"}>
          {subtitle.text}
        </span>
      </div>
    </div>
  );
};

export default BudgetCard;