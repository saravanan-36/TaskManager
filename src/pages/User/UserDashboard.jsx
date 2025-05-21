import React, { useEffect, useState, useContext } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import InfoCard from "../../components/cards/InfoCard";
import { addThousandSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskLIstTable";
import CustomPieChart from "../../components/charts/CustomPieChart";
import CustomBarChart from "../../components/charts/CustomBarChart";

const UserDashboard = () => {
  useUserAuth();
  const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {};
    const taskPriorityLevels = data?.taskPriorityLevels || {};

    const taskDistributionData = [
  { status: "Pending", count: taskDistribution?.Pending || 0 },
  { status: "In Progress", count: taskDistribution?.InProgress || 0 },
  { status: "Completed", count: taskDistribution?.Completed || 0 },
];

setPieChartData(taskDistributionData);

    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];
    setBarChartData(priorityLevelData);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_USER_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || {});
      }
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div className="col-span-3">
          <h2 className="text-xl md:text-2xl">Good morning {user?.name}</h2>
          <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
            {moment().format("dddd, MMMM Do YYYY, h:mm:ss a")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            label="Total Tasks"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0
            )}
            color="bg-primary"
          />
          <InfoCard
            label="Pending Tasks"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.Pending || 0
            )}
            color="bg-amber-500"
          />
          <InfoCard
            label="In Progress Tasks"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.InProgress || 0
            )}
            color="bg-cyan-500"
          />
          <InfoCard
            label="Completed Tasks"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.Completed || 0
            )}
            color="bg-lime-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-medium">Task Distribution</h5>
          </div>
          {pieChartData.length > 0 ? (
            <CustomPieChart data={pieChartData} label="status" colors={COLORS} />
          ) : (
            <p className="text-gray-400 text-sm">No data available</p>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-medium">Task Priority Levels</h5>
          </div>
          {barChartData.length > 0 ? (
            <CustomBarChart data={barChartData} />
          ) : (
            <p className="text-gray-400 text-sm">No data available</p>
          )}
        </div>

        <div className="card md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg">Recent Tasks</h5>
            <button className="card-btn flex items-center gap-1" onClick={onSeeMore}>
              See All <LuArrowRight className="text-base" />
            </button>
          </div>
          <TaskListTable tableData={dashboardData?.recentTasks || []} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
