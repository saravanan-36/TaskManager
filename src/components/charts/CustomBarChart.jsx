import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomBarChart = ({ data }) => {
  // Ensure the priority values are capitalized consistently
  const getBarColor = (entry) => {
    switch (entry?.priority) {
      case "Low":
        return "#00BC70"; // Green
      case "Medium":
        return "#FE9900"; // Orange
      case "High":
        return "#FF1F57"; // Red
      default:
        return "#CBD5E1"; // Light gray fallback
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { priority, count } = payload[0].payload;
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-xs font-semibold text-purple-800 mb-1">
            {priority}
          </p>
          <p className="text-sm text-gray-600">
            Count:{" "}
            <span className="text-sm font-medium text-gray-900">{count}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6">
      {data?.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="priority"
              tick={{ fontSize: 12, fill: "#555" }}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 12, fill: "#555" }} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
            <Bar dataKey="count" radius={[10, 10, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-sm text-gray-500 p-4">No priority data to display</p>
      )}
    </div>
  );
};

export default CustomBarChart;
