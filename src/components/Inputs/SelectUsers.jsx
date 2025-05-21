import React, { useEffect, useState, useMemo } from "react";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import Modal from "../Modal";
import AvatarGroup from "../AvatarGroup";
import { LuUsers } from "react-icons/lu";

const SelectUsers = ({ selectedUsers = [], setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setAllUsers(response.data);
      } else {
        setAllUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  const selectedUserAvatars = useMemo(() => {
    return allUsers
      .filter((user) => selectedUsers.includes(user._id))
      .map((user) => user.profileImageUrl);
  }, [allUsers, selectedUsers]);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    setTempSelectedUsers(selectedUsers);
  }, [selectedUsers]);

  return (
    <div className="space-y-4 mt-2">
      {selectedUserAvatars.length === 0 ? (
        <button
          type="button"
          className="card-btn flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <LuUsers className="text-sm" /> Add Members
        </button>
      ) : (
        <div
          className="cursor-pointer"
          onClick={() => setIsModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && setIsModalOpen(true)}
          aria-label="Open user selection modal"
        >
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Select Users">
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.length === 0 && (
            <p className="text-center text-gray-500">No users available.</p>
          )}
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 border border-gray-200 rounded"
            >
              <img
                src={user.profileImageUrl}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-[13px] text-gray-600 truncate">{user.email}</p>
              </div>
              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
                aria-label={`Select user ${user.name}`}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button className="card-btn" onClick={() => setIsModalOpen(false)} type="button">
            CANCEL
          </button>
          <button className="card-btn-fill" onClick={handleAssign} type="button">
            DONE
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
