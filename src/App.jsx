import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeTab from './tabs/HomeTab';
import ClassifierTab from './tabs/ClassifierTab';
import DatasetTab from './tabs/DatasetTab';
import ModelLabTab from './tabs/ModelLabTab';
import HowItWorksTab from './tabs/HowItWorksTab';
import AboutTab from './tabs/AboutTab';
import Footer from './sections/Footer';
import ApiConfigModal from './components/ApiConfigModal';

const VALID_TABS = ['home', 'classifier', 'dataset', 'model-lab', 'how-it-works', 'about'];

function getTabFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
  return VALID_TABS.includes(hash) ? hash : 'home';
}

export default function App() {
  const [activeTab, setActiveTab] = useState(getTabFromHash);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [preselectedImage, setPreselectedImage] = useState(null);

  // Sync tab with browser hash and history navigation
  useEffect(() => {
    const handleHashChange = () => {
      const tab = getTabFromHash();
      setActiveTab(tab);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tabId) => {
    if (!VALID_TABS.includes(tabId)) return;
    setActiveTab(tabId);
    window.location.hash = `#/${tabId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSpecimen = (sample) => {
    setPreselectedImage({
      file: null,
      name: sample.name,
      size: 'Sample Specimen',
      type: 'image/jpeg',
      url: sample.url,
      isSample: true,
      species: sample.species,
      sampleClass: sample.class
    });
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header & Tab Navigation Bar */}
      <Navbar 
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        onOpenApiModal={() => setIsApiModalOpen(true)} 
      />

      {/* Main Tab Content View */}
      <main id="main-content" style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <HomeTab 
            onNavigate={handleTabChange} 
            onSelectSpecimen={handleSelectSpecimen} 
          />
        )}

        {activeTab === 'classifier' && (
          <ClassifierTab 
            onOpenConfigModal={() => setIsApiModalOpen(true)} 
            preselectedImage={preselectedImage}
          />
        )}

        {activeTab === 'dataset' && (
          <DatasetTab />
        )}

        {activeTab === 'model-lab' && (
          <ModelLabTab 
            onOpenConfigModal={() => setIsApiModalOpen(true)} 
          />
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorksTab />
        )}

        {activeTab === 'about' && (
          <AboutTab 
            onOpenConfigModal={() => setIsApiModalOpen(true)} 
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        onSelectTab={handleTabChange}
        onOpenConfigModal={() => setIsApiModalOpen(true)} 
      />

      {/* API / Backend Config Modal */}
      <ApiConfigModal 
        isOpen={isApiModalOpen} 
        onClose={() => setIsApiModalOpen(false)} 
      />
    </div>
  );
}
