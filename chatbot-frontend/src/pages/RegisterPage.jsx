import React, { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            await register(username, email, password, confirmPassword);
            alert("Registration successful! Please login.");
            navigate('/');
        } catch (error) {
            console.error("Registration failed", error);
            alert("Registration failed: " + (error.response?.data?.username || error.response?.data?.password || "Unknown error"));
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="card w-full max-w-4xl bg-gray-800/40 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10 lg:flex-row overflow-hidden">
                {/* Left Side - Hero */}
                <div className="lg:w-1/2 p-12 flex flex-col justify-center bg-linear-to-br from-blue-600/20 to-indigo-600/20">
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">Join EdgeChat</h1>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Create an account to start real-time conversions with developers worldwide.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-gray-400">
                            <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center">1</div>
                            <span>Instant messaging</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400">
                            <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center">2</div>
                            <span>Create private rooms</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400">
                            <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center">3</div>
                            <span>Developer community</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="lg:w-1/2 p-8 lg:p-12">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                             <h2 className="text-2xl font-bold text-white">Sign Up</h2>
                             <p className="text-gray-400">Enter your details to create an account</p>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-300">Username</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="johndoe" 
                                className="input input-bordered bg-gray-900/50 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                                required 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-300">Email (Optional)</span>
                            </label>
                            <input 
                                type="email" 
                                placeholder="john@example.com" 
                                className="input input-bordered bg-gray-900/50 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-300">Password</span>
                                </label>
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    className="input input-bordered bg-gray-900/50 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-300">Confirm</span>
                                </label>
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    className="input input-bordered bg-gray-900/50 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                                    required 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button className="btn btn-primary w-full bg-linear-to-r from-blue-500 to-indigo-600 border-none hover:shadow-lg hover:shadow-blue-500/30 text-white" type="submit">
                            Create Account
                        </button>

                        <div className="text-center">
                            <span className="text-gray-400 text-sm">
                                Already have an account? <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium">Log in</Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
