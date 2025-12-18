import React, { useEffect, useState } from "react";
import RoomList from "../components/RoomList";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import CreateRoomModal from "../components/CreateRoomModal";
import NameRoomModal from "../components/NameRoomModal";
import {
  getRooms,
  getMessage,
  sendMessage,
  getUsers,
  createRoom,
  updateRoomName,
} from "../api/chatapi";

const ChatPage = () => {
  const [rooms, setRooms] = useState([]);
  const [messages, setMessage] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeRoomName, setActiveRoomName] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });
  const [isEditingRoomName, setIsEditingRoomName] = useState(false);
  const [editRoomName, setEditRoomName] = useState("");
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollTrigger, setScrollTrigger] = useState(0);

  const [currentUser, setCurrentUser] = useState({
    id: parseInt(localStorage.getItem('userId')),
    username: localStorage.getItem('username') || 'You'
  });

  useEffect(() => {
    getRooms().then((res) => setRooms(res.data));
    getUsers().then((res) => {
        // Filter out current user
        const otherUsers = res.data.filter(u => u.id !== currentUser.id);
        setUsers(otherUsers);
    });
  }, [currentUser.id]);

  const handleUserSelect = (userId) => {
    // Find the user data
    const user = users.find(u => u.id === userId);
    setSelectedUserId(userId);
    setSelectedUserData(user);
    setIsNameModalOpen(true);
  };

  const handleRoomNameConfirm = async (roomName) => {
    try {
      // If no custom name provided, use the other user's username
      const finalRoomName = roomName || selectedUserData?.username || null;
      
      const res = await createRoom(selectedUserId, finalRoomName);
      const roomsResponse = await getRooms();
      setRooms(roomsResponse.data);
      const roomId = res.data.room_id || res.data.id;
      setActiveRoom(roomId);
      const room = roomsResponse.data.find(rm => rm.id === roomId);
      const displayName = room?.name || `Room #${roomId}`;
      const userNames = room?.users?.map(u => u.username).join(', ') || '';
      setActiveRoomName(`${displayName} ${userNames ? `(${userNames})` : ''}`);
      setActiveRoomName(`${displayName} ${userNames ? `(${userNames})` : ''}`);
      setSidebarOpen(false);
      setIsNameModalOpen(false);
      setSelectedUserId(null);
      setSelectedUserData(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRoomSelect = (roomId) => {
    setActiveRoom(roomId);
    const room = rooms.find(r => r.id === roomId);
    const displayName = room?.name || `Room #${roomId}`;
    const userNames = room?.users?.map(u => u.username).join(', ') || '';
    setActiveRoomName(`${displayName} ${userNames ? `(${userNames})` : ''}`);
    setSidebarOpen(false);
  };

  const handleRoomNameUpdate = async (roomId, name) => {
    try {
      await updateRoomName(roomId, name);
      const roomsResponse = await getRooms();
      setRooms(roomsResponse.data);
      
      // Update active room name if it's the current room
      if (activeRoom === roomId) {
        const room = roomsResponse.data.find(r => r.id === roomId);
        const displayName = room?.name || `Room #${roomId}`;
        const userNames = room?.users?.map(u => u.username).join(', ') || '';
        setActiveRoomName(`${displayName} ${userNames ? `(${userNames})` : ''}`);
      }
      setIsEditingRoomName(false);
    } catch (error) {
      console.error('Failed to update room name:', error);
    }
  };

  const handleEditRoomNameClick = () => {
    const room = rooms.find(r => r.id === activeRoom);
    setEditRoomName(room?.name || "");
    setIsEditingRoomName(true);
  };

  const handleCancelEdit = () => {
    setIsEditingRoomName(false);
    setEditRoomName("");
  };

  useEffect(() => {
    if (!activeRoom) return;

    setMessage([]); // Clear messages on room switch to reset scroll


    // Initial fetch
    getMessage(activeRoom).then((res) => setMessage(res.data));

    // Polling every 3 seconds
    const intervalId = setInterval(() => {
      getMessage(activeRoom).then((res) => {
        setMessage((prevMessages) => {
          const newMessages = res.data;
          // Simple check: different length or last message ID different
          if (newMessages.length !== prevMessages.length) return newMessages;
          if (newMessages.length > 0 && newMessages[newMessages.length - 1].id !== prevMessages[prevMessages.length - 1].id) {
            return newMessages;
          }
          // If equal, return previous state to avoid re-render
          return prevMessages;
        });
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [activeRoom]);

  const send = async (text, file) => {
    await sendMessage(activeRoom, text, file);
    const res = await getMessage(activeRoom);
    setMessage(res.data);
    setScrollTrigger(prev => prev + 1);
  };

  return (
    <div className="h-screen font-sans overflow-hidden transition-colors duration-200">
      <div className="h-full dark:bg-gray-900 dark:text-gray-100 bg-gray-50 text-gray-900 transition-colors duration-200">
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 z-50 p-2 rounded-lg dark:bg-gray-800 bg-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg border dark:border-gray-700 border-gray-200"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-800 dark:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex h-full">
          {/* Sidebar */}
          <div
            className={`
            fixed lg:relative inset-y-0 left-0 z-50
            w-80 dark:bg-gray-800 dark:border-gray-700 bg-white border-r border-gray-200
            flex flex-col
            transform transition-transform duration-300 ease-out
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
          >
            {/* Header */}
            <div className="p-6 border-b dark:border-gray-700 dark:bg-gray-800 border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    EdgeChat
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">Just Chatting</p>
                </div>
                <button
                  className="p-2 rounded-lg hover:bg-gray-700 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Rooms Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                    Rooms
                  </h3>
                    <div className="flex gap-2">
                      <button onClick={() => setIsModalOpen(true)} className="p-1 rounded dark:hover:bg-gray-700 hover:bg-gray-200 dark:text-gray-400 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors" title="New Chat">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <span className="px-2 py-1 text-xs dark:bg-gray-700 bg-gray-200 dark:text-gray-200 text-gray-700 rounded-full">
                        {rooms.length}
                      </span>
                    </div>
                </div>
                <RoomList
                  rooms={rooms}
                  onSelect={handleRoomSelect}
                  activeRoom={activeRoom}
                />
              </div>

              {/* Divider */}
              <div className="border-t dark:border-gray-700 border-gray-200"></div>

              {/* Online Users Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                    Online people
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="px-2 py-1 text-xs dark:bg-gray-700 bg-gray-200 dark:text-gray-200 text-gray-700 rounded-full">
                      {users.length}
                    </span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {users.map((u) => (
                    <li
                      key={u.id}
                      onClick={() => handleUserSelect(u.id)}
                      className="group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg dark:hover:bg-gray-700/50 hover:bg-gray-100 transition-colors">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="font-medium text-sm">
                              {u.username.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 dark:border-gray-800 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {u.username}
                          </p>
                          <p className="text-xs text-gray-400">Friend</p>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-500 group-hover:text-blue-400"
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
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t dark:border-gray-700 dark:bg-gray-800 border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-linear-to-br dark:from-gray-700 dark:to-gray-600 from-gray-200 to-gray-300 dark:text-gray-200 text-gray-700 flex items-center justify-center">
                  <span className="font-medium text-sm">{currentUser.username.substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm dark:text-gray-200 text-gray-800">{currentUser.username}</p>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Online
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {activeRoom ? (
              <>
                {/* Header */}
                <div className="h-16 border-b dark:border-gray-700 border-gray-200 dark:bg-gray-800/80 bg-white/80 backdrop-blur-sm px-4 lg:px-6 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button
                      className="p-2 rounded-lg hover:bg-gray-700 lg:hidden"
                      onClick={() => setSidebarOpen(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                        ROOM
                      </div>
                      {isEditingRoomName ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editRoomName}
                            onChange={(e) => setEditRoomName(e.target.value)}
                            className="flex-1 px-3 py-1.5 text-sm dark:bg-gray-700 bg-gray-100 border dark:border-gray-600 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Enter room name"
                            autoFocus
                          />
                          <button
                            onClick={() => handleRoomNameUpdate(activeRoom, editRoomName)}
                            className="p-2 rounded-lg hover:bg-green-600/20 text-green-400 transition-colors"
                            title="Save"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 rounded-lg hover:bg-red-600/20 text-red-400 transition-colors"
                            title="Cancel"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <h2 className="text-lg font-semibold truncate">
                            {activeRoomName}
                          </h2>
                          <button
                            onClick={handleEditRoomNameClick}
                            className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-blue-400 transition-colors"
                            title="Edit room name"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <MessageList messages={messages} scrollTrigger={scrollTrigger} />

                {/* Input */}
                <MessageInput roomId={activeRoom} onSend={send} />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <button
                  className="p-2 rounded-lg hover:bg-gray-700 lg:hidden absolute top-4 left-4"
                  onClick={() => setSidebarOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <div className="text-center space-y-6 max-w-md">
                  <div className="text-7xl mb-4">💬</div>
                  <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Welcome to EdgeChat
                  </h1>
                  <p className="dark:text-gray-400 text-gray-500 text-lg">
                    Select a person or room to start the conversation.
                  </p>
                  <div className="flex gap-4 justify-center pt-6">
                    <div className="px-6 py-4 dark:bg-gray-800 bg-white rounded-xl border dark:border-gray-700 border-gray-200 shadow-sm">
                      <div className="text-2xl font-bold text-blue-400">
                        {rooms.length}
                      </div>
                      <div className="text-sm text-gray-400">Active Rooms</div>
                    </div>
                    <div className="px-6 py-4 dark:bg-gray-800 bg-white rounded-xl border dark:border-gray-700 border-gray-200 shadow-sm">
                      <div className="text-2xl font-bold text-green-400">
                        {users.length}
                      </div>
                      <div className="text-sm text-gray-400">No. of people Online</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <CreateRoomModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRoomCreated={(data) => {
          // data contains { userId, user }
          setSelectedUserId(data.userId);
          setSelectedUserData(data.user);
          setIsModalOpen(false);
          setIsNameModalOpen(true);
        }}
      />
      <NameRoomModal
        isOpen={isNameModalOpen}
        onClose={() => {
          setIsNameModalOpen(false);
          setSelectedUserId(null);
          setSelectedUserData(null);
        }}
        onConfirm={handleRoomNameConfirm}
        selectedUser={selectedUserData}
      />
    </div>
  );
};

export default ChatPage;