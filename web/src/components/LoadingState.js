import React from "react";
import "./LoadingState.css";

/**
 * LoadingState Component
 *
 * Displays a loading skeleton with animated pulse effect.
 * Used across the app for async data loading.
 *
 * Usage:
 * {isLoading && <LoadingState message="Loading your finances..." />}
 */

export default function LoadingState({
  message = "Loading...",
  variant = "default", // 'default', 'minimal', 'full-screen'
  itemCount = 3,
}) {
  if (variant === "minimal") {
    return (
      <div className="loading-state loading-state--minimal">
        <div className="spinner"></div>
        {message && <p className="loading-message">{message}</p>}
      </div>
    );
  }

  if (variant === "full-screen") {
    return (
      <div className="loading-state loading-state--full-screen">
        <div className="loading-container">
          <div className="spinner spinner--large"></div>
          {message && (
            <p className="loading-message loading-message--large">{message}</p>
          )}
          <p className="loading-hint">This usually takes a few seconds...</p>
        </div>
      </div>
    );
  }

  // Default variant - shows skeleton cards
  return (
    <div className="loading-state">
      {/* Header Skeleton */}
      <div className="skeleton-section">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-subtitle"></div>
      </div>

      {/* Cards Skeleton */}
      <div className="skeleton-cards">
        {Array.from({ length: itemCount }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton skeleton-icon"></div>
            <div className="skeleton skeleton-card-title"></div>
            <div className="skeleton skeleton-card-amount"></div>
            <div className="skeleton skeleton-bar"></div>
          </div>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div className="loading-footer">
          <div className="spinner spinner--small"></div>
          <p className="loading-message">{message}</p>
        </div>
      )}
    </div>
  );
}
