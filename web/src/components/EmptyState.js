import React from "react";
import "./EmptyState.css";

/**
 * EmptyState Component
 *
 * Displays when no data is available.
 * Provides context and clear action items.
 *
 * Usage:
 * {data.length === 0 && (
 *   <EmptyState
 *     icon="📊"
 *     title="No transactions yet"
 *     description="Start tracking your income and expenses"
 *     action="Add Transaction"
 *     onAction={handleAddTransaction}
 *   />
 * )}
 */

export default function EmptyState({
  icon = "📭",
  title = "No data available",
  description = "There's nothing to show here yet.",
  message,
  action,
  onAction,
  secondaryAction,
  onSecondaryAction,
  variant = "default", // 'default', 'minimal', 'full-screen'
}) {
  // Use message as fallback for description
  const displayDescription = description || message;

  if (variant === "minimal") {
    return (
      <div className="empty-state empty-state--minimal">
        <p className="empty-state__icon">{icon}</p>
        <p className="empty-state__title">{title}</p>
      </div>
    );
  }

  if (variant === "full-screen") {
    return (
      <div className="empty-state empty-state--full-screen">
        <div className="empty-state__container">
          <div className="empty-state__icon-large">{icon}</div>
          <h2 className="empty-state__title">{title}</h2>
          {displayDescription && (
            <p className="empty-state__description">{displayDescription}</p>
          )}
          {action && (
            <button
              className="empty-state__button empty-state__button--primary"
              onClick={onAction}
            >
              {action}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="empty-state">
      {/* Visual */}
      <div className="empty-state__visual">
        <p className="empty-state__icon">{icon}</p>
      </div>

      {/* Content */}
      <div className="empty-state__content">
        <h3 className="empty-state__title">{title}</h3>
        {displayDescription && (
          <p className="empty-state__description">{displayDescription}</p>
        )}
      </div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="empty-state__actions">
          {action && (
            <button
              className="empty-state__button empty-state__button--primary"
              onClick={onAction}
            >
              {action}
            </button>
          )}
          {secondaryAction && (
            <button
              className="empty-state__button empty-state__button--secondary"
              onClick={onSecondaryAction}
            >
              {secondaryAction}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Common Empty State Variants
 *
 * Pre-configured empty states for common scenarios
 */

export function NoTransactionsEmpty({ onAddTransaction }) {
  return (
    <EmptyState
      icon="📊"
      title="No transactions yet"
      description="Start by adding your income and expenses to see your financial picture."
      action="Add Transaction"
      onAction={onAddTransaction}
    />
  );
}

export function NoGoalsEmpty({ onAddGoal }) {
  return (
    <EmptyState
      icon="🎯"
      title="No financial goals yet"
      description="Set goals to stay motivated and track your progress."
      action="Create Goal"
      onAction={onAddGoal}
    />
  );
}

export function NoObligationsEmpty({ onAddObligation }) {
  return (
    <EmptyState
      icon="📋"
      title="No upcoming obligations"
      description="Add loans, EMIs, or other commitments you need to track."
      action="Add Obligation"
      onAction={onAddObligation}
    />
  );
}

export function ErrorEmpty({ message = "Something went wrong", onRetry }) {
  return (
    <EmptyState
      icon="⚠️"
      title="Oops! Something went wrong"
      description={message}
      action="Try Again"
      onAction={onRetry}
    />
  );
}

export function NoDataEmpty({ type = "data" }) {
  const states = {
    dashboard: {
      icon: "💰",
      title: "No financial data",
      description: "Add transactions to see your Safe-to-Save and allocation.",
    },
    simulator: {
      icon: "🎮",
      title: "No scenarios to simulate",
      description:
        "Create some transactions first, then simulate what-if scenarios.",
    },
    copilot: {
      icon: "🤖",
      title: "No financial state",
      description: "I need your transaction data to help you.",
    },
  };

  const state = states[type] || states.dashboard;

  return (
    <EmptyState
      icon={state.icon}
      title={state.title}
      description={state.description}
      variant="default"
    />
  );
}

export function OfflineEmpty({ onRetry }) {
  return (
    <EmptyState
      icon="📡"
      title="You're offline"
      description="Check your internet connection and try again."
      action="Retry"
      onAction={onRetry}
      variant="minimal"
    />
  );
}
