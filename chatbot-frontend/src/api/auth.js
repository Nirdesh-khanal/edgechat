import api from "./axios";

export const login = (username, password) => 
    api.post("/auth/login/", { username, password });

export const register = (username, email, password, confirmPassword) =>
    api.post("/chat/register/", { username, email, password, confirm_password: confirmPassword });