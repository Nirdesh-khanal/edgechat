import React from 'react'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './auth/ProtectedRoute'
import { Routes, Route, Navigate } from 'react-router-dom';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <>
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/chat" replace /> : <LoginPage/>}
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/chat" replace /> : <RegisterPage/>}
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatPage/>
              </ProtectedRoute>
            }
          />
        </Routes>
    </>
  )
}

export default App;