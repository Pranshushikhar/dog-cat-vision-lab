import React from 'react';
import PerformanceSection from '../sections/PerformanceSection';
import ArchitectureSection from '../sections/ArchitectureSection';
import ExperimentLabSection from '../sections/ExperimentLabSection';

export default function ModelLabTab({ onOpenConfigModal }) {
  return (
    <div className="tab-pane-container">
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* 1. Quantitative Performance & Real Evaluation Charts */}
        <PerformanceSection />

        {/* 2. Neural Architecture & Layer Inspector */}
        <div style={{ marginTop: '40px' }}>
          <ArchitectureSection />
        </div>

        {/* 3. Sensitivity Benchmark Sandbox */}
        <div style={{ marginTop: '40px' }}>
          <ExperimentLabSection onOpenConfigModal={onOpenConfigModal} />
        </div>
      </div>
    </div>
  );
}
