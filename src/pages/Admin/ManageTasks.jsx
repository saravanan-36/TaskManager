import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/cards/TaskCard";
import toast from "react-hot-toast";

const ManageTasks = () => {
  const [alltasks, setAlltasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus.toLowerCase(),
        },
      });

      const tasks = response.data?.tasks || [];
      setAlltasks(tasks);

      const statusSummary = response.data?.statusSummary || {};

      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks.");
    }
  };

  const handleClick = (taskData) => {
    navigate(`/admin/create-tasks`, { state: { taskId: taskData._id } });
  };

  const handleDownloadReport = async () => {
    try {
      console.log("Export URL:", API_PATHS.TASKS.EXPORT_TASKS);

      // Use the correct API path here:
      const response = await axiosInstance.get(API_PATHS.TASKS.EXPORT_TASKS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_report.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke URL after a small delay to ensure download starts
      setTimeout(() => window.URL.revokeObjectURL(url), 100);

      toast.success("Task report downloaded successfully.");
    } catch (error) {
      console.error("Error downloading task report:", error);
      toast.error("Failed to download task report. Please try again.");
    }
  };

  useEffect(() => {
    getAllTasks();
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="manage Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>

            <button
              className="flex lg:hidden download-btn"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>

          {tabs.length > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />

              <button
                className="hidden lg:flex download-btn"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {alltasks.length === 0 ? (
            <p>No tasks available</p>
          ) : (
            alltasks.map((item) => (
              <TaskCard
                key={item._id || item.title}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={
                  Array.isArray(item.assignedTo)
                    ? item.assignedTo
                        .map((i) => i.profileImageUrl || null)
                        .filter(Boolean)
                    : []
                }
                attachementsCount={item.attachements?.length || 0}
                completedTodoCount={item.completedTodoCount || 0}
                todoChecklist={item.todoChecklist || []}
                onClick={() => handleClick(item)}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
