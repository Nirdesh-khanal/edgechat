import api from "./axios";

export const login = (data) => 
    api.post("/auth/login/", data);

export const getRooms = () => 
    api.get('/chat/rooms/');

export const createRoom = (user_id, name = null) => {
    const data = { user_id };
    if (name) {
        data.name = name;
    }
    return api.post("/chat/rooms/create/", data);
};

export const getUsers = () =>
    api.get("/chat/users/");

export const getMessage = (room_id) => 
    api.get(`/chat/rooms/${room_id}/messages/`)

export const sendMessage = (room, content, file) => {
    const formData = new FormData();
    formData.append('room', room);
    formData.append('content', content);
    if (file) {
        if (file.type.startsWith('image/')) {
            formData.append('image', file);
        } else {
            formData.append('file', file);
        }
    }
    return api.post("/chat/messages/", formData);
}

export const updateRoomName = (roomId, name) =>
    api.patch(`/chat/rooms/${roomId}/update_name/`, { name });