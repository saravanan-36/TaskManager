import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";

const CreateTasks = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [], // corrected spelling
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const todoList = taskData.todoChecklist.map((text) => ({
        text,
        completed: false,
      }));

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      });

      toast.success("Task created successfully.");
      clearData();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);
    try {
      const todoList = taskData.todoChecklist.map((text) => {
        const matched = currentTask?.todoChecklist?.find((t) => t.text === text);
        return {
          text,
          completed: matched ? matched.completed : false,
        };
      });

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      });

      toast.success("Task updated successfully.");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);

    if (!taskData.title.trim()) return setError("Please enter task title.");
    if (!taskData.description.trim()) return setError("Please enter description.");
    if (!taskData.priority) return setError("Please select priority.");
    if (!taskData.dueDate) return setError("Please select due date.");
    if (taskData.assignedTo.length === 0) return setError("Please assign the task.");
    if (taskData.todoChecklist.length === 0) return setError("Checklist cannot be empty.");

    taskId ? updateTask() : createTask();
  };

  const getTaskDetailsById = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      const task = res.data;

      setCurrentTask(task);
      setTaskData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: moment(task.dueDate).format("YYYY-MM-DD"),
        assignedTo: task.assignedTo?.map((u) => u._id) || [],
        todoChecklist: task.todoChecklist?.map((t) => t.text) || [],
        attachments: task.attachments || [],
      });
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      toast.success("Task deleted successfully.");
      navigate("/admin/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    }
  };

  useEffect(() => {
    if (taskId) getTaskDetailsById();
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  className="text-rose-500 bg-rose-50 border border-rose-100 hover:border-rose-300 rounded px-2 py-1 text-sm flex items-center gap-1"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 /> Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">Task Title</label>
              <input
                className="form-input"
                placeholder="Create App UI"
                value={taskData.title}
                onChange={(e) => handleValueChange("title", e.target.value)}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Description</label>
              <textarea
                className="form-input"
                placeholder="Task description"
                value={taskData.description}
                onChange={(e) => handleValueChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Priority</label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={taskData.dueDate || ""}
                  onChange={(e) => handleValueChange("dueDate", e.target.value)}
                />
              </div>
              <div className="col-span-12 md:col-span-8">
                <label className="text-xs font-medium text-slate-600">Assigned To</label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(users) => handleValueChange("assignedTo", users)}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Todo Checklist</label>
              <TodoListInput
                todoList={taskData.todoChecklist}
                setTodoList={(list) => handleValueChange("todoChecklist", list)}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Add Attachments</label>
              <AddAttachmentsInput
                attachments={taskData.attachments}
                setAttachments={(value) => handleValueChange("attachments", value)}
              />
            </div>

            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

            <div className="mt-6 flex justify-end">
              <button className="add-btn" onClick={handleSubmit} disabled={loading}>
                {taskId ? "Update Task" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={openDeleteAlert} onClose={() => setOpenDeleteAlert(false)} title="Delete Task">
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={deleteTask}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTasks;
