import React, { useState } from 'react';

const NameRoomModal = ({ isOpen, onClose, onConfirm, selectedUser }) => {
    const [roomName, setRoomName] = useState('');

    const handleConfirm = () => {
        onConfirm(roomName.trim());
        setRoomName('');
    };

    const handleClose = () => {
        setRoomName('');
        onClose();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleConfirm();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md dark:bg-gray-800 bg-white rounded-xl shadow-xl border dark:border-gray-700 border-gray-200 transition-colors duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold dark:text-white text-gray-900">Name Your Chat Room</h2>
                        <button 
                            onClick={handleClose} 
                            className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                    
                    {selectedUser && (
                        <p className="text-sm text-gray-500 mb-4">
                            Starting a chat with <span className="font-medium text-blue-400">{selectedUser.username}</span>
                        </p>
                    )}

                    <div className="mb-6">
                        <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">
                            Room Name (optional)
                        </label>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={selectedUser ? `Default: ${selectedUser.username}` : "Enter room name..."}
                            className="w-full px-4 py-2.5 dark:bg-gray-900 bg-gray-50 border dark:border-gray-600 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:text-gray-100 text-gray-900 placeholder-gray-500"
                            autoFocus
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            {selectedUser 
                                ? `Leave empty to name the room "${selectedUser.username}"`
                                : "Leave empty to use default name"
                            }
                        </p>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 rounded-lg dark:bg-gray-700 bg-gray-200 dark:text-gray-300 text-gray-700 hover:bg-gray-600 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                            Create Room
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NameRoomModal;
