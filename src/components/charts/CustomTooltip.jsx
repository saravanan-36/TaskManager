import React from 'react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    const item = payload[0].payload;

    return (
      <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
        <p className='text-xs font-semibold text-purple-800 mb-1'>
          {item.priority || item.status || label}
        </p>
        <p className='text-sm text-gray-600'>
          Count: <span className='text-sm font-medium text-gray-900'>{item.count}</span>
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
