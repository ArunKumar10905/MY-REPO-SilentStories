import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
// Lazy load heavy components for better mobile performance
const HomePage = lazy(() => import('./pages/HomePage'));
const StoryPage = lazy(() => import('./pages/StoryPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CreateStory = lazy(() => import('./pages/CreateStory'));
const EditStory = lazy(() => import('./pages/EditStory'));
const UsersComments = lazy(() => import('./pages/UsersComments'));
const Settings = lazy(() => import('./pages/Settings'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const SubmittedStories = lazy(() => import('./pages/SubmittedStories'));
import { onAuthStateChange, logoutUser } from './firebase/firebase';

function App() {
  const [visitorName, setVisitorName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
      
      // Hide offline message after 5 seconds
      setTimeout(() => {
        setShowOfflineMessage(false);
      }, 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem('visitorName');
    if (storedName) {
      setVisitorName(storedName);
    }

    // Set up Firebase auth state listener
    try {
      const unsubscribe = onAuthStateChange((user) => {
        if (user) {
          // User is signed in
          localStorage.setItem('adminToken', user.accessToken);
          setIsAdmin(true);
        } else {
          // User is signed out
          localStorage.removeItem('adminToken');
          setIsAdmin(false);
        }
        setLoading(false);
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    } catch (error) {
      console.error('Firebase auth initialization error:', error);
      // Fallback: check if there's a stored token
      const adminToken = localStorage.getItem('adminToken');
      setIsAdmin(!!adminToken);
      setLoading(false);
    }

    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleNameSubmit = (name) => {
    setVisitorName(name);
    localStorage.setItem('visitorName', name);
    setShowNameModal(false);
  };

  const handleNameChange = (newName) => {
    setVisitorName(newName);
    localStorage.setItem('visitorName', newName);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if Firebase logout fails, clear local storage
      localStorage.removeItem('adminToken');
    }
    // Regardless of Firebase logout success, update UI state
    setIsAdmin(false);
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        {/* Offline message */}
        {showOfflineMessage && (
          <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50 animate-pulse">
            You are currently offline. Some features may be limited.
          </div>
        )}
        
        <AnimatePresence mode="wait">
          <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/visitor" element={
                <Layout
                  visitorName={visitorName}
                  onNameChange={handleNameChange}
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  isAdmin={isAdmin}
                  onLogout={handleLogout}
                  showNameModal={showNameModal}
                  onNameSubmit={handleNameSubmit}
                >
                  <HomePage visitorName={visitorName} setShowNameModal={setShowNameModal} />
                </Layout>
              } />
              <Route path="/story/:id" element={
                <Layout
                  visitorName={visitorName}
                  onNameChange={handleNameChange}
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  isAdmin={isAdmin}
                  onLogout={handleLogout}
                  showNameModal={showNameModal}
                  onNameSubmit={handleNameSubmit}
                >
                  <StoryPage visitorName={visitorName} setShowNameModal={setShowNameModal} />
                </Layout>
              } />
              <Route path="/admin/login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
              <Route path="/admin/dashboard" element={
                <Layout
                  visitorName={visitorName}
                  onNameChange={handleNameChange}
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  isAdmin={isAdmin}
                  onLogout={handleLogout}
                  showNameModal={showNameModal}
                  onNameSubmit={handleNameSubmit}
                >
                  {isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />}
                </Layout>
              } />
              <Route path="/admin/create-story" element={
                <Layout
                  visitorName={visitorName}
                  onNameChange={handleNameChange}
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  isAdmin={isAdmin}
                  onLogout={handleLogout}
                  showNameModal={showNameModal}
                  onNameSubmit={handleNameSubmit}
                >
                  {isAdmin ? <CreateStory /> : <Navigate to="/admin/login" />}
                </Layout>
              } />
              <Route path="/admin/edit-story/:id" element={
                <Layout
                  visitorName={visitorName}
                  onNameChange={handleNameChange}
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  isAdmin={isAdmin}
                  onLogout={handleLogout}
                  showNameModal={showNameModal}
                  onNameSubmit={handleNameSubmit}
                >
                  {isAdmin ? <EditStory /> : <Navigate to="/admin/login" />}
                </Layout>
              } />
              <Route path="/admin/users-comments" element={
                <Layout
                  visitorName={visitorName}
                  onNameChange={handleNameChange}
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  isAdmin={isAdmin}
                  onLogout={handleLogout}
                  showNameModal={showNameModal}
                  onNameSubmit={handleNameSubmit}
                >
                  {isAdmin ? <UsersComments /> : <Navigate to="/admin/login" />}
                </Layout>
              } />
              <Route path="/admin/submitted-stories" element={
                <Layout
                  visitorName={visitorName}
                  onNameChange={handleNameChange}
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  isAdmin={isAdmin}
                  onLogout={handleLogout}
                  showNameModal={showNameModal}
                  onNameSubmit={handleNameSubmit}
                >
                  {isAdmin ? <SubmittedStories /> : <Navigate to="/admin/login" />}
                </Layout>
              } />
              <Route path="/admin/settings" element={
                <Layout
                  visitorName={visitorName}
                  onNameChange={handleNameChange}
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  isAdmin={isAdmin}
                  onLogout={handleLogout}
                  showNameModal={showNameModal}
                  onNameSubmit={handleNameSubmit}
                >
                  {isAdmin ? <Settings /> : <Navigate to="/admin/login" />}
                </Layout>
              } />
              <Route path="/privacy-policy" element={
                <Layout
                  visitorName={visitorName}
                  onNameChange={handleNameChange}
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  isAdmin={isAdmin}
                  onLogout={handleLogout}
                  showNameModal={showNameModal}
                  onNameSubmit={handleNameSubmit}
                >
                  <PrivacyPolicy />
                </Layout>
              } />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;