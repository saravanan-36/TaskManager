import React from "react";

const AvatarGroup = ({ avatars = [], maxVisible = 3 }) => {
  return (
    <div className="flex items-center">
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`Avatar ${index + 1}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-avatar.png"; // fallback image path
          }}
          className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0 object-cover bg-gray-200"
        />
      ))}
      {avatars.length > maxVisible && (
        <div className="w-9 h-9 flex items-center justify-center bg-blue-100 text-xs font-medium rounded-full border-2 border-white -ml-3">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
