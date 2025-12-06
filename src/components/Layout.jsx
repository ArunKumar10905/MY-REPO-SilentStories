import React from 'react';
import Header from './Header';
import Footer from './Footer';
import NameEntryModal from './NameEntryModal';
import { AnimatePresence } from 'framer-motion';

function Layout({ 
  children, 
  visitorName, 
  onNameChange, 
  darkMode, 
  toggleDarkMode, 
  isAdmin, 
  onLogout,
  showNameModal,
  onNameSubmit
}) {
  return (
    <>
      <Header 
        visitorName={visitorName} 
        onNameChange={onNameChange}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        isAdmin={isAdmin}
        onLogout={onLogout}
      />
      
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
        {children}
      </main>

      <Footer />

      <AnimatePresence>
        {showNameModal && !visitorName && (
          <NameEntryModal onSubmit={onNameSubmit} />
        )}
      </AnimatePresence>
    </>
  );
}

export default Layout;



