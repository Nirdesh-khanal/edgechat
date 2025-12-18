import React, { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(username, password);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.user_id);
            localStorage.setItem('username', res.data.username);
            navigate('/chat');
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed");
        }
    };

    return (

        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
                <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-gray-800/50 rounded-full blur-3xl"></div>
            </div>

            <div className="card w-full max-w-4xl bg-gray-800/40 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10 lg:flex-row-reverse overflow-hidden">
                 {/* Right Side - Hero (reversed) */}
                 <div className="lg:w-1/2 p-12 flex flex-col justify-center bg-linear-to-bl from-blue-600/20 to-indigo-600/20">
                    <div className="mb-8 text-right">
                        <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 ml-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">Welcome Back</h1>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Log in to verify your identity and continue your conversations.
                        </p>
                    </div>
                </div>

                {/* Left Side - Form */}
                <div className="lg:w-1/2 p-8 lg:p-12">
                     <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                             <h2 className="text-2xl font-bold text-white">Login</h2>
                             <p className="text-gray-400">Access your EdgeChat account</p>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-300">Username</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="Enter your user name" 
                                className="input input-bordered bg-gray-900/50 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                                required 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-300">Password</span>
                            </label>
                            <input 
                                type="password" 
                                placeholder="Enter your password" 
                                className="input input-bordered bg-gray-900/50 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-control mt-8">
                            <button className="btn btn-primary w-full bg-linear-to-r from-blue-500 to-indigo-600 border-none hover:shadow-lg hover:shadow-blue-500/30 text-white" type="submit">
                                Login Access
                            </button>
                        </div>
                         <div className="text-center">
                            <span className="text-gray-400 text-sm">
                                Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">Register</Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;