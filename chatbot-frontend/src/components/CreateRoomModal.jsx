import React, { useEffect, useState } from 'react';
import { getUsers, createRoom } from '../api/chatapi';

const CreateRoomModal = ({ isOpen, onClose, onRoomCreated }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            getUsers()
                .then(res => setUsers(res.data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    const handleCreate = (userId) => {
        const user = users.find(u => u.id === userId);
        onRoomCreated({ userId, user });
        onClose();
    };

    if (!isOpen) return null;

    const filteredUsers = users.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="card w-full max-w-md dark:bg-gray-800 bg-white shadow-xl border dark:border-gray-700 border-gray-200 max-h-[80vh] flex flex-col transition-colors duration-200">
                <div className="card-body p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="card-title text-xl dark:text-white text-gray-900">New Chat</h2>
                        <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost text-gray-400">✕</button>
                    </div>
                    
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        className="input input-bordered w-full dark:bg-gray-900 bg-gray-50 dark:border-gray-600 border-gray-300 focus:border-blue-500 mb-4 text-gray-900 dark:text-gray-100 placeholder-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="overflow-y-auto flex-1 space-y-2 pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center p-4">
                                <span className="loading loading-spinner text-primary"></span>
                            </div>
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg dark:hover:bg-gray-700/50 hover:bg-gray-100 transition-colors cursor-pointer group" onClick={() => handleCreate(user.id)}>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar placeholder">
                                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                <span className="text-sm">{user.username.substring(0, 2).toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium dark:text-gray-200 text-gray-800">{user.username}</p>
                                            <p className="text-xs text-gray-500">User</p>
                                        </div>
                                    </div>
                                    <button className="btn btn-sm btn-primary no-animation opacity-0 group-hover:opacity-100 transition-opacity">
                                        Chat
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                No users found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateRoomModal;
