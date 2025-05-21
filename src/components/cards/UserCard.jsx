import React from 'react';

const UserCard = ({ userInfo }) => {
  // Provide fallback image URL
  const fallbackImage = "/images/default-avatar.png"; // Adjust this path or use any placeholder image URL

  const imageUrl =
    userInfo?.profileImageUrl && userInfo.profileImageUrl !== ""
      ? userInfo.profileImageUrl
      : fallbackImage;

  return (
    <div className="user-card p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={imageUrl}
            alt={`Avatar`}
            className="w-12 h-12 rounded-full border-2 border-white"
            onError={(e) => {
              e.currentTarget.onerror = null; // prevents looping
              e.currentTarget.src = fallbackImage;
            }}
          />
          <div>
            <p className="text-sm font-medium">{userInfo?.name}</p>
            <p className="text-xs text-gray-500">{userInfo?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-3 mt-5">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="pending"
        />
        <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}  
          status="In Progress"
        />
        <StatCard
          label="Completed"
          count={userInfo?.completedTasks || 0}  
          status="Completed"
        />
      </div>
    </div>
  );
};

export default UserCard;

const StatCard = ({ label, count, status }) => {
  const getstatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-gray-50";

      case "Completed":
        return "text-indigo-500 bg-gray-50";

      default:
        return "text-rose-500 bg-gray-50";
    }
  };
  return (
    <div
      className={`flex text-[10px] font-medium ${getstatusTagColor()} px-4 py-0.5 rounded`}
    >
      <span className="text-[12px] font-semibold">{count}</span> <br /> {label}
    </div>
  );
};
