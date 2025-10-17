import React from 'react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, description, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className="text-blue-600">{icon}</div>}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
};

export default MetricsCard;