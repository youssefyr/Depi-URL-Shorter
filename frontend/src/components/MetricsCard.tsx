import React from 'react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, description, icon }) => {
  return (
    <div className="relative bg-primary dark:bg-dark-primary rounded-2xl shadow-neumorphic dark:shadow-neumorphic-dark p-6 text-center transition-all duration-300 hover:shadow-neumorphic-inset dark:hover:shadow-neumorphic-dark-inset overflow-hidden">
      <div className="absolute inset-0 bg-glow dark:bg-glow-blue opacity-10"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-3">
          {icon && <div className="text-accent mr-3">{icon}</div>}
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">{title}</h3>
        </div>
        <p className="text-5xl font-bold text-gray-800 dark:text-gray-200 mb-2 tracking-tight">{value}</p>
        {description && <p className="text-md text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
    </div>
  );
};

export default MetricsCard;