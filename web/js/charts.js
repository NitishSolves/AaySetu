/**
 * GigFinance Web - Native SVG Charts Engine
 * Ultra-fast, responsive SVG charting without heavy external libraries.
 */

import { formatCurrency } from './data.js';

/**
 * Render Interactive Trend Line Chart
 */
export function renderTrendChart(containerId, transactions) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Group transactions by date
  const dateMap = {};
  transactions.forEach((tx) => {
    const d = tx.date || 'Unknown';
    if (!dateMap[d]) {
      dateMap[d] = { date: d, income: 0, expense: 0 };
    }
    if (tx.type === 'income') dateMap[d].income += Number(tx.amount || 0);
    else if (tx.type === 'expense') dateMap[d].expense += Number(tx.amount || 0);
  });

  const sortedDates = Object.keys(dateMap).sort().slice(-7);
  if (sortedDates.length < 2) {
    container.innerHTML = `
      <div class="empty-chart-state">
        <p>Record at least 2 days of transactions to generate an earnings trend line.</p>
      </div>`;
    return;
  }

  const dataPoints = sortedDates.map((d) => dateMap[d]);
  const maxVal = Math.max(...dataPoints.map((p) => Math.max(p.income, p.expense, 1000))) * 1.15;

  const width = 580;
  const height = 240;
  const padding = { top: 25, right: 30, bottom: 35, left: 55 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Compute coordinates
  const getX = (idx) => padding.left + (idx / (dataPoints.length - 1)) * graphWidth;
  const getY = (val) => padding.top + graphHeight - (val / maxVal) * graphHeight;

  // Build SVG path
  const incomeCoords = dataPoints.map((p, idx) => ({ x: getX(idx), y: getY(p.income), ...p }));
  const expenseCoords = dataPoints.map((p, idx) => ({ x: getX(idx), y: getY(p.expense), ...p }));

  const incomePathD = incomeCoords.map((pt, i) => (i === 0 ? `M ${pt.x},${pt.y}` : `L ${pt.x},${pt.y}`)).join(' ');
  const expensePathD = expenseCoords.map((pt, i) => (i === 0 ? `M ${pt.x},${pt.y}` : `L ${pt.x},${pt.y}`)).join(' ');

  // Gradient area path for Income
  const areaIncomeD = `${incomePathD} L ${incomeCoords[incomeCoords.length - 1].x},${padding.top + graphHeight} L ${incomeCoords[0].x},${padding.top + graphHeight} Z`;

  // Format short date for X-axis labels
  const formatShortDate = (dateStr) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${parseInt(parts[2])} ${months[parseInt(parts[1]) - 1]}`;
    }
    return dateStr;
  };

  // Horizontal Grid Lines
  const gridLevels = [0, 0.33, 0.66, 1];
  const gridLines = gridLevels.map((lvl) => {
    const yVal = padding.top + graphHeight - lvl * graphHeight;
    const labelVal = Math.round(maxVal * lvl);
    return `
      <line x1="${padding.left}" y1="${yVal}" x2="${width - padding.right}" y2="${yVal}" stroke="var(--border)" stroke-dasharray="4 4" stroke-width="1" />
      <text x="${padding.left - 8}" y="${yVal + 4}" font-size="10" fill="var(--text-muted)" text-anchor="end">${formatCurrency(labelVal)}</text>
    `;
  }).join('');

  // Date Labels
  const dateLabels = dataPoints.map((pt, i) => `
    <text x="${getX(i)}" y="${height - 10}" font-size="10.5" font-weight="600" fill="var(--text-secondary)" text-anchor="middle">
      ${formatShortDate(pt.date)}
    </text>
  `).join('');

  // Points and hover tooltips
  const dotsAndTooltips = incomeCoords.map((pt) => `
    <g class="chart-point">
      <circle cx="${pt.x}" cy="${pt.y}" r="5" fill="#16A34A" stroke="#FFFFFF" stroke-width="2" />
      <title>${pt.date}: Inflow ${formatCurrency(pt.income)}, Outflow ${formatCurrency(pt.expense)}</title>
    </g>
  `).join('') + expenseCoords.map((pt) => `
    <g class="chart-point">
      <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="#DC2626" stroke="#FFFFFF" stroke-width="2" />
      <title>${pt.date}: Outflow ${formatCurrency(pt.expense)}</title>
    </g>
  `).join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" class="svg-chart" style="width: 100%; height: 100%; overflow: visible;">
      <defs>
        <linearGradient id="incomeAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#16A34A" stop-opacity="0.28" />
          <stop offset="100%" stop-color="#16A34A" stop-opacity="0.0" />
        </linearGradient>
      </defs>

      <!-- Grid lines & Y labels -->
      ${gridLines}

      <!-- Income Area -->
      <path d="${areaIncomeD}" fill="url(#incomeAreaGrad)" />

      <!-- Inflow Line -->
      <path d="${incomePathD}" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Outflow Line -->
      <path d="${expensePathD}" fill="none" stroke="#DC2626" stroke-width="2.5" stroke-dasharray="3 3" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Interactive Data Dots -->
      ${dotsAndTooltips}

      <!-- X-axis Date Labels -->
      ${dateLabels}
    </svg>
  `;
}

/**
 * Render Interactive SVG Donut Chart
 */
export function renderDonutChart(containerId, items, centerValue, centerSubtext) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="empty-chart-state">
        <p>No expense data recorded to build breakdown.</p>
      </div>`;
    return;
  }

  const size = 200;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  const segments = items.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += item.percentage;

    return `
      <circle
        cx="${size / 2}"
        cy="${size / 2}"
        r="${radius}"
        fill="transparent"
        stroke="${item.color}"
        stroke-width="${strokeWidth}"
        stroke-dasharray="${strokeDasharray}"
        stroke-dashoffset="${strokeDashoffset}"
        stroke-linecap="round"
        class="donut-segment"
      >
        <title>${item.name}: ${formatCurrency(item.amount)} (${item.percentage}%)</title>
      </circle>
    `;
  }).join('');

  container.innerHTML = `
    <div style="position: relative; width: ${size}px; height: ${size}px; margin: 0 auto;">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg); transform-origin: 50% 50%;">
        <!-- Background Track -->
        <circle
          cx="${size / 2}"
          cy="${size / 2}"
          r="${radius}"
          fill="transparent"
          stroke="var(--surface-alt)"
          stroke-width="${strokeWidth}"
        />
        ${segments}
      </svg>
      <div class="donut-center-info">
        <div class="donut-center-val">${centerValue}</div>
        <div class="donut-center-label">${centerSubtext}</div>
      </div>
    </div>
  `;
}
