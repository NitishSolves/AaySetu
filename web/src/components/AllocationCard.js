import React from "react";
import "./AllocationCard.css";

/**
 * AllocationCard Component
 *
 * Displays breakdown of Safe-to-Save allocation across categories:
 * - Savings (Emergency fund)
 * - Goals (Long-term savings)
 * - Discretionary (Flexible spending)
 *
 * Usage:
 * <AllocationCard
 *   allocation={{
 *     savings: 150,
 *     goals: 100,
 *     discretionary: 100
 *   }}
 *   totalSafeToSave={350}
 *   currency="₹"
 * />
 */

export default function AllocationCard({
  allocation = {
    savings: 0,
    goals: 0,
    discretionary: 0,
  },
  totalSafeToSave = 0,
  currency = "₹",
  isLoading = false,
  error = null,
  onCategoryClick = null,
}) {
  if (isLoading) {
    return (
      <div className="allocation-card loading">
        <div className="skeleton skeleton-title"></div>
        <div className="allocation-items">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton skeleton-item"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="allocation-card error">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  // Calculate percentages
  const total = Object.values(allocation).reduce((a, b) => a + b, 0);
  const getPercentage = (amount) =>
    total > 0 ? Math.round((amount / total) * 100) : 0;

  const categories = [
    {
      key: "savings",
      label: "Emergency Savings",
      icon: "💾",
      color: "green",
      description: "Build your safety net",
      amount: allocation.savings,
    },
    {
      key: "goals",
      label: "Goal Fund",
      icon: "🎯",
      color: "blue",
      description: "Work towards your dreams",
      amount: allocation.goals,
    },
    {
      key: "discretionary",
      label: "Flexible Spending",
      icon: "🎁",
      color: "purple",
      description: "Enjoy guilt-free",
      amount: allocation.discretionary,
    },
  ];

  return (
    <div className="allocation-card">
      {/* Header */}
      <div className="allocation-header">
        <h3 className="allocation-title">💡 How to Use Safe-to-Save</h3>
        <p className="allocation-subtitle">
          Recommended allocation of {currency}
          {Math.round(totalSafeToSave).toLocaleString("en-IN")}
        </p>
      </div>

      {/* Allocation Items */}
      <div className="allocation-items">
        {categories.map((category) => {
          const percentage = getPercentage(category.amount);
          const amount = Math.round(category.amount);

          return (
            <div
              key={category.key}
              className={`allocation-item allocation-item--${category.color}`}
              onClick={() => onCategoryClick && onCategoryClick(category.key)}
              role={onCategoryClick ? "button" : undefined}
              tabIndex={onCategoryClick ? 0 : undefined}
            >
              {/* Category Header */}
              <div className="allocation-item__header">
                <div className="allocation-item__title">
                  <span className="allocation-item__icon">{category.icon}</span>
                  <div className="allocation-item__label">
                    <h4 className="allocation-item__name">{category.label}</h4>
                    <p className="allocation-item__description">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="allocation-item__amount">
                  <span className="allocation-currency">{currency}</span>
                  <span className="allocation-value">
                    {amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="allocation-item__progress">
                <div
                  className={`progress-bar progress-bar--${category.color}`}
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>

              {/* Percentage */}
              <div className="allocation-item__footer">
                <span className="allocation-percentage">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips Section */}
      <div className="allocation-tips">
        <div className="tip">
          <span className="tip-icon">💡</span>
          <p className="tip-text">
            <strong>Emergency Savings</strong> keeps 3-6 months of expenses safe
          </p>
        </div>
        <div className="tip">
          <span className="tip-icon">🎯</span>
          <p className="tip-text">
            <strong>Goal Fund</strong> builds towards bigger dreams
          </p>
        </div>
        <div className="tip">
          <span className="tip-icon">🎁</span>
          <p className="tip-text">
            <strong>Flexible Spending</strong> lets you enjoy guilt-free
          </p>
        </div>
      </div>

      {/* Summary */}
      {total > 0 && (
        <div className="allocation-summary">
          <div className="summary-row">
            <span className="summary-label">Total Available:</span>
            <span className="summary-value">
              {currency}
              {Math.round(totalSafeToSave).toLocaleString("en-IN")}
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Allocated:</span>
            <span className="summary-value">
              {currency}
              {Math.round(total).toLocaleString("en-IN")}
            </span>
          </div>
          {total < totalSafeToSave && (
            <div className="summary-row summary-row--warning">
              <span className="summary-label">Unallocated:</span>
              <span className="summary-value">
                {currency}
                {Math.round(totalSafeToSave - total).toLocaleString("en-IN")}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
