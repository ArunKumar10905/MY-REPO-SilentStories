import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import StoryPage from './pages/StoryPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CreateStory from './pages/CreateStory';
import EditStory from './pages/EditStory';
import UsersComments from './pages/UsersComments';
import Settings from './pages/Settings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SubmittedStories from './pages/SubmittedStories';

function App() {
  const [visitorName, setVisitorName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedName = localStorage.getItem('visitorName');
    if (storedName) {
      setVisitorName(storedName);
    }

    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setIsAdmin(true);
    }

    // Simpler auth check without Firebase listener
    setLoading(false);

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

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
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
        <AnimatePresence mode="wait">
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
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;