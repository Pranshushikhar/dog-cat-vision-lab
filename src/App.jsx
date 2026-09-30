import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import ClassifierSection from './sections/ClassifierSection';
import HowCnnSeesSection from './sections/HowCnnSeesSection';
import ArchitectureSection from './sections/ArchitectureSection';
import DatasetSection from './sections/DatasetSection';
import PerformanceSection from './sections/PerformanceSection';
import ComparisonSection from './sections/ComparisonSection';
import StorySection from './sections/StorySection';
import TechStackSection from './sections/TechStackSection';
import ExperimentLabSection from './sections/ExperimentLabSection';
import InsightsSection from './sections/InsightsSection';
import Footer from './sections/Footer';
import ApiConfigModal from './components/ApiConfigModal';

export default function App() {
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Sticky Header */}
      <Navbar onOpenApiModal={() => setIsApiModalOpen(true)} />

      {/* Main Semantic Content */}
      <main id="main-content" style={{ flex: 1 }}>
        <Hero />
        <ClassifierSection onOpenConfigModal={() => setIsApiModalOpen(true)} />
        <HowCnnSeesSection />
        <ArchitectureSection />
        <DatasetSection />
        <PerformanceSection />
        <ComparisonSection />
        <StorySection />
        <TechStackSection />
        <ExperimentLabSection onOpenConfigModal={() => setIsApiModalOpen(true)} />
        <InsightsSection />
      </main>

      {/* Footer */}
      <Footer onOpenConfigModal={() => setIsApiModalOpen(true)} />

      {/* API / Backend Config Modal */}
      <ApiConfigModal 
        isOpen={isApiModalOpen} 
        onClose={() => setIsApiModalOpen(false)} 
      />
    </div>
  );
}
