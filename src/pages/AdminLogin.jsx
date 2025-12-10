import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle, Mail, Key } from 'lucide-react';
import { loginUser } from '../firebase/firebase';

function AdminLogin({ setIsAdmin }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [firebaseStatus, setFirebaseStatus] = useState('checking'); // 'checking', 'ok', 'error'
  const navigate = useNavigate();

  useEffect(() => {
    // Check Firebase connectivity
    const checkFirebase = async () => {
      try {
        // Simple check - try to access Firebase auth
        const { auth } = await import('../firebase/firebase');
        if (auth) {
          setFirebaseStatus('ok');
        } else {
          setFirebaseStatus('error');
        }
      } catch (err) {
        console.error('Firebase connection error:', err);
        setFirebaseStatus('error');
        setError('Unable to connect to authentication service. Please check your internet connection.');
      }
    };

    checkFirebase();
  }, []);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password');
      return;
    }
    
    if (credentials.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const user = await loginUser(credentials.email, credentials.password);
      localStorage.setItem('adminToken', user.accessToken);
      if (setIsAdmin) {
        setIsAdmin(true);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      
      // More specific error handling
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (err.code === 'auth/user-disabled') {
        setError('This account has been disabled.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password authentication is not enabled in Firebase. Please enable it in the Firebase Console.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No user found with this email. Please check your email or create an account.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="mx-auto bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Access the story management dashboard
            </p>
          </div>

          {firebaseStatus === 'checking' && (
            <div className="mb-6 p-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg flex items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mr-2"
              />
              <span>Checking authentication service...</span>
            </div>
          )}

          {firebaseStatus === 'error' && (
            <div className="mb-6 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Authentication service unavailable. Please check your internet connection and try again.</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 admin-login-form">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="admin@example.com"
                  required
                  disabled={firebaseStatus !== 'ok'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-12"
                  placeholder="••••••••"
                  required
                  disabled={firebaseStatus !== 'ok'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center password-toggle"
                  disabled={firebaseStatus !== 'ok'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || firebaseStatus !== 'ok'}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </motion.button>
          </form>

          

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;