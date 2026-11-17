import React from 'react';

/**
 * ModelStatusBadge
 *
 * Compact horizontal status and validated accuracy component.
 * Displays real-time model operational status and verified accuracy metric.
 * Guaranteed never to wrap awkwardly, with full accessibility support,
 * truthful model-backed semantics, and responsive layout.
 *
 * Suggested appearance:
 * [ ● MODEL ONLINE ]  [ 98.55% ACCURACY ]
 */
export default function ModelStatusBadge({
  healthStatus = 'checking', // 'checking' | 'online' | 'offline' | 'error'
  accuracy = null,           // number (e.g. 98.55), or null if unverified
  latencyMs = null,
  onClick
}) {
  // 1. Resolve truthful model status label and pulse dot indicator
  let statusText = 'CHECKING MODEL';
  let statusShortText = 'CHECKING';
  let dotClass = 'idle';
  let statusTitle = 'Checking backend health and model status...';

  if (healthStatus === 'online') {
    statusText = 'MODEL ONLINE';
    statusShortText = 'ONLINE';
    dotClass = 'success';
    statusTitle = `MobileNetV2 CNN loaded in memory & ready for real-time inference${latencyMs ? ` (${latencyMs}ms latency)` : ''}.`;
  } else if (healthStatus === 'offline') {
    statusText = 'MODEL OFFLINE';
    statusShortText = 'OFFLINE';
    dotClass = 'idle';
    statusTitle = 'Backend microservice is offline or sleeping on Render. Click to wake server or test connection.';
  } else if (healthStatus === 'error') {
    statusText = 'WEIGHTS MISSING';
    statusShortText = 'MISSING';
    dotClass = 'error';
    statusTitle = 'Backend reached, but CNN model weights (models/dog_cat_cnn.keras) are missing.';
  } else {
    // 'checking'
    statusText = 'CHECKING MODEL';
    statusShortText = 'CHECKING';
    dotClass = 'warning';
    statusTitle = 'Pinging FastAPI inference backend...';
  }

  // 2. Resolve truthful validation accuracy metric
  let accuracyText = 'Accuracy unavailable';
  let accuracyShortText = 'Unavailable';
  const hasValidAccuracy = typeof accuracy === 'number' && !Number.isNaN(accuracy) && accuracy > 0;

  if (healthStatus === 'online' && hasValidAccuracy) {
    const formattedAcc = Number(accuracy).toFixed(2);
    accuracyText = `${formattedAcc}% ACCURACY`;
    accuracyShortText = `${formattedAcc}%`;
  } else if (healthStatus === 'checking') {
    accuracyText = 'VERIFYING ACCURACY';
    accuracyShortText = '...';
  } else {
    accuracyText = 'Accuracy unavailable';
    accuracyShortText = 'Unavailable';
  }

  const fullTooltip = `${statusTitle} · ${
    hasValidAccuracy ? `Validation Accuracy: ${Number(accuracy).toFixed(2)}%` : 'Accuracy unavailable'
  }. Click for endpoint settings.`;

  return (
    <div
      className={`model-status-cluster status-${healthStatus}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick();
        }
      }}
      title={fullTooltip}
      aria-label={`Model status: ${statusText}, ${accuracyText}`}
    >
      {/* Horizontal Status Pill */}
      <div className="status-pill">
        <span className={`pulse-dot ${dotClass}`} aria-hidden="true" />
        <span className="badge-text-desktop">{statusText}</span>
        <span className="badge-text-mobile">{statusShortText}</span>
      </div>

      {/* Horizontal Accuracy Pill */}
      <div className={`accuracy-pill ${hasValidAccuracy && healthStatus === 'online' ? 'available' : 'unavailable'}`}>
        <span className="badge-text-desktop">{accuracyText}</span>
        <span className="badge-text-mobile">{accuracyShortText}</span>
      </div>
    </div>
  );
}
