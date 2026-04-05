import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate(result.role === 'teacher' ? '/teacher' : '/student');
    } else {
      setError(result.msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-darkest p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-primary-dark p-8 text-white text-center">
          <h2 className="text-3xl font-bold">Portal Login</h2>
          <p className="mt-2 text-accent-light">Assignment Management System</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-darkest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-base" size={20} />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-accent-pale rounded-xl focus:ring-2 focus:ring-primary-base outline-none transition-all"
                placeholder="teacher@test.com or student@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-darkest">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-base" size={20} />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 border border-accent-pale rounded-xl focus:ring-2 focus:ring-primary-base outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-primary-dark hover:bg-primary-darkest text-white font-bold rounded-xl transition-all shadow-lg active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
