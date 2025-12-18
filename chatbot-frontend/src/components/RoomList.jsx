// RoomList.js
import React from "react";

const RoomList = ({ rooms, onSelect, activeRoom }) => {
  const getRoomDisplayName = (room) => {
    return room.name || `Room #${room.id}`;
  };

  return (
    <div className="space-y-1">
      {rooms.map((room) => (
        <button
          key={room.id}
          onClick={() => onSelect(room.id)}
          className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
            activeRoom === room.id
              ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
              : "dark:hover:bg-gray-700/50 hover:bg-gray-100 dark:text-gray-300 text-gray-700"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              activeRoom === room.id ? "bg-blue-400" : "dark:bg-gray-600 bg-gray-400"
            }`}
          ></div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{getRoomDisplayName(room)}</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default RoomList;