import React from 'react';
import DatasetSection from '../sections/DatasetSection';

export default function DatasetTab() {
  return (
    <div className="tab-pane-container">
      <div className="container" style={{ maxWidth: '980px' }}>
        <DatasetSection />
      </div>
    </div>
  );
}
