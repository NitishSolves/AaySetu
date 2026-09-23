import React from "react";
import "./FinancialCard.css";

/**
 * FinancialCard Component
 *
 * A reusable card component for displaying financial metrics.
 * Supports different themes, icons, and layout variants.
 *
 * Usage:
 * <FinancialCard
 *   title="Safe-to-Save"
 *   amount={350}
 *   currency="₹"
 *   subtitle="Available to save today"
 *   icon="💾"
 *   status="healthy"
 *   trend="up"
 *   trendValue="+12%"
 * />
 */

export default function FinancialCard({
  title,
  amount,
  currency = "₹",
  subtitle,
  description,
  icon,
  status = "neutral", // 'healthy', 'warning', 'danger', 'neutral'
  trend, // 'up', 'down', null
  trendValue,
  onClick,
  isLoading = false,
  error = null,
  variant = "default", // 'default', 'minimal', 'highlighted'
  size = "md", // 'sm', 'md', 'lg'
}) {
  if (isLoading) {
    return (
      <div
        className={`financial-card financial-card--${variant} financial-card--${size} loading`}
      >
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-amount"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`financial-card financial-card--${variant} financial-card--${size} error`}
      >
        <p className="error-message">{error}</p>
      </div>
    );
  }

  const formattedAmount = amount
    ? Math.round(amount).toLocaleString("en-IN")
    : "0";

  return (
    <div
      className={`financial-card financial-card--${variant} financial-card--${size} financial-card--${status}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Icon Section */}
      {icon && (
        <div className="financial-card__icon">
          <span className="icon-emoji">{icon}</span>
        </div>
      )}

      {/* Header */}
      <div className="financial-card__header">
        <h3 className="financial-card__title">{title}</h3>
        {subtitle && <p className="financial-card__subtitle">{subtitle}</p>}
      </div>

      {/* Amount Section */}
      <div className="financial-card__amount">
        <span className="amount-currency">{currency}</span>
        <span className="amount-value">{formattedAmount}</span>
      </div>

      {/* Trend Indicator */}
      {trendValue && (
        <div className={`financial-card__trend trend-${trend}`}>
          <span className="trend-icon">
            {trend === "up" ? "📈" : trend === "down" ? "📉" : "➡️"}
          </span>
          <span className="trend-value">{trendValue}</span>
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="financial-card__description">{description}</p>
      )}

      {/* Status Badge */}
      {status !== "neutral" && (
        <div className={`financial-card__badge status-${status}`}>
          {status === "healthy" && "✓ Healthy"}
          {status === "warning" && "⚠ Warning"}
          {status === "danger" && "✗ Critical"}
        </div>
      )}
    </div>
  );
}
