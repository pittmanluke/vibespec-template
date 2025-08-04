#!/usr/bin/env node
/**
 * VibeSpec Health Dashboard Renderer
 * 
 * Terminal-friendly health visualization system that transforms complex metrics
 * into intuitive ASCII art dashboards with sub-second rendering performance.
 */

const fs = require('fs');
const path = require('path');

class HealthDashboardRenderer {
  constructor(options = {}) {
    this.terminalWidth = options.terminalWidth || process.stdout.columns || 80;
    this.colorSupport = options.colorSupport !== false && process.stdout.isTTY;
    this.unicodeSupport = options.unicodeSupport !== false;
    
    // Color codes for different health statuses
    this.colors = {
      critical: '\x1b[91m',  // Bright red
      warning: '\x1b[93m',   // Bright yellow
      good: '\x1b[92m',      // Bright green
      excellent: '\x1b[96m', // Bright cyan
      neutral: '\x1b[37m',   // White
      reset: '\x1b[0m',      // Reset
      bold: '\x1b[1m',       // Bold
      dim: '\x1b[2m'         // Dim
    };
    
    // Unicode symbols for better visualization
    this.symbols = {
      filled: this.unicodeSupport ? '█' : '#',
      empty: this.unicodeSupport ? '░' : '-',
      spark: this.unicodeSupport ? ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'] : ['_', '.', ':', ';', '|', '!', 'I', '#'],
      arrow: {
        up: this.unicodeSupport ? '↑' : '^',
        down: this.unicodeSupport ? '↓' : 'v',
        right: this.unicodeSupport ? '→' : '>',
        stable: this.unicodeSupport ? '→' : '-'
      },
      status: {
        critical: this.unicodeSupport ? '🔴' : '[!]',
        warning: this.unicodeSupport ? '⚠️' : '[W]',
        good: this.unicodeSupport ? '✅' : '[OK]',
        excellent: this.unicodeSupport ? '🎯' : '[++]'
      }
    };
  }

  /**
   * Render complete health dashboard
   */
  renderHealthDashboard(healthData) {
    const output = [];
    
    // Header with overall health score
    output.push(this.renderHeader(healthData));
    output.push('');
    
    // Overall health score visualization
    output.push(this.renderOverallHealth(healthData.overallScore, healthData.trend));
    output.push('');
    
    // Dimensional breakdown
    output.push(this.renderDimensionalBreakdown(healthData.dimensions));
    output.push('');
    
    // Issue summary
    output.push(this.renderIssueSummary(healthData.issues));
    output.push('');
    
    // Trend analysis if historical data available
    if (healthData.history) {
      output.push(this.renderTrendAnalysis(healthData.history));
      output.push('');
    }
    
    // Top recommendations
    output.push(this.renderRecommendations(healthData.recommendations));
    output.push('');
    
    // Footer with metadata
    output.push(this.renderFooter(healthData.metadata));
    
    return output.join('\n');
  }

  /**
   * Render dashboard header
   */
  renderHeader(healthData) {
    const title = 'VIBESPEC PROJECT HEALTH DASHBOARD';
    const border = '═'.repeat(Math.min(title.length, this.terminalWidth - 4));
    
    return this.colorize('bold', [
      border,
      title,
      border
    ].join('\n'));
  }

  /**
   * Render overall health score with large progress indicator
   */
  renderOverallHealth(score, trend = {}) {
    const barWidth = Math.min(50, this.terminalWidth - 25);
    const filledWidth = Math.round((score / 100) * barWidth);
    const emptyWidth = barWidth - filledWidth;
    
    const bar = this.symbols.filled.repeat(filledWidth) + 
                this.symbols.empty.repeat(emptyWidth);
    
    const status = this.getHealthStatus(score);
    const trendIndicator = this.getTrendIndicator(trend);
    
    const lines = [
      `Overall Health Score: ${this.colorize(status.color, score + '/100')} ${this.colorize(status.color, '[' + status.label + ']')}`,
      '',
      `${this.colorize(status.color, bar)} ${score}% ${trendIndicator}`
    ];
    
    return lines.join('\n');
  }

  /**
   * Render dimensional breakdown with individual progress bars
   */
  renderDimensionalBreakdown(dimensions) {
    const lines = [this.colorize('bold', '📊 DIMENSIONAL BREAKDOWN:')];
    
    const maxLabelWidth = Math.max(...Object.keys(dimensions).map(k => k.length));
    const barWidth = Math.min(30, this.terminalWidth - maxLabelWidth - 20);
    
    Object.entries(dimensions).forEach(([dimension, data]) => {
      const label = dimension.charAt(0).toUpperCase() + dimension.slice(1).replace(/([A-Z])/g, ' $1');
      const paddedLabel = label.padEnd(maxLabelWidth);
      
      const filledWidth = Math.round((data.score / 100) * barWidth);
      const emptyWidth = barWidth - filledWidth;
      
      const status = this.getHealthStatus(data.score);
      const bar = this.colorize(status.color, 
        this.symbols.filled.repeat(filledWidth) + 
        this.symbols.empty.repeat(emptyWidth)
      );
      
      const trendIndicator = this.getTrendIndicator(data.trend || {});
      
      lines.push(`├── ${paddedLabel}: ${bar} ${data.score}/100 ${trendIndicator}`);
    });
    
    return lines.join('\n');
  }

  /**
   * Render issue summary with counts and status indicators
   */
  renderIssueSummary(issues) {
    const lines = [this.colorize('bold', '🚨 ISSUE SUMMARY:')];
    
    const critical = issues.critical || 0;
    const warnings = issues.warnings || 0;
    const passed = issues.passed || 0;
    
    lines.push(`├── Critical Issues: ${this.colorize('critical', critical)} ${critical > 0 ? this.symbols.status.critical : ''}`);
    lines.push(`├── Warning Issues:  ${this.colorize('warning', warnings)} ${warnings > 0 ? this.symbols.status.warning : ''}`);
    lines.push(`└── Passed Checks:   ${this.colorize('good', passed)} ${this.symbols.status.good}`);
    
    return lines.join('\n');
  }

  /**
   * Render sparkline trend analysis
   */
  renderTrendAnalysis(history) {
    if (!history || history.length < 2) {
      return this.colorize('dim', '📈 TREND ANALYSIS: Insufficient data for trend analysis');
    }
    
    const lines = [this.colorize('bold', '📈 TREND ANALYSIS:')];
    
    // Generate sparkline for overall health
    const sparkline = this.generateSparkline(history.map(h => h.overallScore));
    const trendDirection = this.calculateTrendDirection(history);
    const trendPercentage = this.calculateTrendPercentage(history);
    
    lines.push(`Overall Health Trend: ${sparkline} ${trendDirection} ${trendPercentage}`);
    
    // Add mini trends for each dimension if available
    if (history[0].dimensions) {
      const dimensions = Object.keys(history[0].dimensions);
      dimensions.forEach(dim => {
        const values = history.map(h => h.dimensions[dim]?.score || 0);
        const miniSparkline = this.generateSparkline(values, 10);
        const dimTrend = this.calculateTrendDirection(values);
        
        lines.push(`├── ${dim}: ${miniSparkline} ${dimTrend}`);
      });
    }
    
    return lines.join('\n');
  }

  /**
   * Render prioritized recommendations
   */
  renderRecommendations(recommendations) {
    if (!recommendations || recommendations.length === 0) {
      return this.colorize('good', '🎯 All health metrics are optimal - no immediate actions required');
    }
    
    const lines = [this.colorize('bold', '🎯 TOP RECOMMENDATIONS:')];
    
    recommendations.slice(0, 5).forEach((rec, index) => {
      const priority = rec.priority || 'medium';
      const priorityColor = priority === 'high' ? 'critical' : 
                           priority === 'medium' ? 'warning' : 'neutral';
      
      const priorityLabel = `[${priority.toUpperCase()}]`;
      const impact = rec.impact ? ` (Impact: ${rec.impact})` : '';
      
      lines.push(`${index + 1}. ${this.colorize(priorityColor, priorityLabel)} ${rec.title}${impact}`);
      
      if (rec.description) {
        lines.push(`   ${this.colorize('dim', rec.description)}`);
      }
    });
    
    return lines.join('\n');
  }

  /**
   * Render footer with metadata
   */
  renderFooter(metadata) {
    const timestamp = metadata.timestamp || new Date().toISOString();
    const duration = metadata.duration ? ` (${metadata.duration}ms)` : '';
    const nextCheck = metadata.nextCheck ? ` | Next check: ${metadata.nextCheck}` : '';
    
    return this.colorize('dim', [
      '─'.repeat(Math.min(this.terminalWidth - 4, 60)),
      `Generated: ${timestamp}${duration}${nextCheck}`
    ].join('\n'));
  }

  /**
   * Generate ASCII progress bar
   */
  generateProgressBar(value, max = 100, width = 20, options = {}) {
    const percentage = Math.min(100, (value / max) * 100);
    const filledWidth = Math.round((percentage / 100) * width);
    const emptyWidth = width - filledWidth;
    
    const status = this.getHealthStatus(percentage);
    const bar = this.symbols.filled.repeat(filledWidth) + 
                this.symbols.empty.repeat(emptyWidth);
    
    const colorizedBar = options.color !== false ? 
      this.colorize(status.color, bar) : bar;
    
    return {
      bar: colorizedBar,
      percentage: Math.round(percentage),
      status: status.label
    };
  }

  /**
   * Generate sparkline from data array
   */
  generateSparkline(data, maxWidth = 20) {
    if (!data || data.length === 0) return '';
    
    const width = Math.min(maxWidth, data.length);
    const step = data.length > width ? Math.floor(data.length / width) : 1;
    const samples = [];
    
    for (let i = 0; i < data.length; i += step) {
      if (samples.length >= width) break;
      samples.push(data[i]);
    }
    
    const min = Math.min(...samples);
    const max = Math.max(...samples);
    const range = max - min || 1;
    
    return samples.map(value => {
      const normalized = (value - min) / range;
      const index = Math.floor(normalized * (this.symbols.spark.length - 1));
      return this.symbols.spark[index];
    }).join('');
  }

  /**
   * Generate comparison chart between two datasets
   */
  generateComparisonChart(current, previous, labels, options = {}) {
    const width = options.width || Math.min(40, this.terminalWidth - 30);
    const lines = [this.colorize('bold', options.title || 'COMPARISON CHART:')];
    
    const maxValue = Math.max(...current, ...previous);
    const maxLabelWidth = Math.max(...labels.map(l => l.length));
    
    labels.forEach((label, index) => {
      const currentVal = current[index] || 0;
      const previousVal = previous[index] || 0;
      const paddedLabel = label.padEnd(maxLabelWidth);
      
      // Current value bar
      const currentBar = this.generateProgressBar(currentVal, maxValue, width);
      const change = currentVal - previousVal;
      const changeIndicator = change > 0 ? 
        this.colorize('good', `+${change.toFixed(1)}`) :
        change < 0 ? 
        this.colorize('critical', change.toFixed(1)) :
        this.colorize('neutral', '±0');
      
      lines.push(`${paddedLabel}: ${currentBar.bar} ${currentVal} ${changeIndicator}`);
    });
    
    return lines.join('\n');
  }

  /**
   * Generate distribution chart (histogram)
   */
  generateDistributionChart(data, buckets = 10, options = {}) {
    if (!data || data.length === 0) return 'No data available for distribution';
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const bucketSize = (max - min) / buckets;
    const distribution = new Array(buckets).fill(0);
    
    // Populate buckets
    data.forEach(value => {
      const bucketIndex = Math.min(buckets - 1, Math.floor((value - min) / bucketSize));
      distribution[bucketIndex]++;
    });
    
    const maxCount = Math.max(...distribution);
    const chartHeight = options.height || 8;
    const lines = [this.colorize('bold', options.title || 'DISTRIBUTION:')];
    
    // Draw histogram
    for (let row = chartHeight - 1; row >= 0; row--) {
      let line = '';
      distribution.forEach(count => {
        const barHeight = (count / maxCount) * chartHeight;
        line += barHeight > row ? this.symbols.filled : ' ';
      });
      lines.push(line);
    }
    
    // Add x-axis labels
    const labels = distribution.map((_, i) => {
      const bucketStart = min + (i * bucketSize);
      return bucketStart.toFixed(0);
    });
    lines.push(labels.join(''));
    
    return lines.join('\n');
  }

  /**
   * Utility: Get health status based on score
   */
  getHealthStatus(score) {
    if (score >= 90) return { color: 'excellent', label: 'EXCELLENT' };
    if (score >= 75) return { color: 'good', label: 'GOOD' };
    if (score >= 60) return { color: 'warning', label: 'NEEDS ATTENTION' };
    return { color: 'critical', label: 'CRITICAL' };
  }

  /**
   * Utility: Get trend indicator
   */
  getTrendIndicator(trend) {
    if (!trend || typeof trend.change === 'undefined') return '';
    
    const change = trend.change;
    if (change > 0) {
      return this.colorize('good', `${this.symbols.arrow.up} +${change.toFixed(1)}%`);
    } else if (change < 0) {
      return this.colorize('critical', `${this.symbols.arrow.down} ${change.toFixed(1)}%`);
    } else {
      return this.colorize('neutral', `${this.symbols.arrow.stable} ±0%`);
    }
  }

  /**
   * Utility: Calculate trend direction from history
   */
  calculateTrendDirection(history) {
    if (!history || history.length < 2) return '';
    
    const recent = history.slice(-3);
    const older = history.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) return '';
    
    const recentAvg = recent.reduce((sum, val) => sum + (val.overallScore || val), 0) / recent.length;
    const olderAvg = older.reduce((sum, val) => sum + (val.overallScore || val), 0) / older.length;
    
    const change = recentAvg - olderAvg;
    
    if (change > 2) return this.colorize('good', this.symbols.arrow.up + ' Improving');
    if (change < -2) return this.colorize('critical', this.symbols.arrow.down + ' Declining');
    return this.colorize('neutral', this.symbols.arrow.stable + ' Stable');
  }

  /**
   * Utility: Calculate trend percentage
   */
  calculateTrendPercentage(history) {
    if (!history || history.length < 2) return '';
    
    const current = history[history.length - 1].overallScore;
    const previous = history[history.length - 2].overallScore;
    const change = ((current - previous) / previous) * 100;
    
    return change !== 0 ? `(${change > 0 ? '+' : ''}${change.toFixed(1)}%)` : '';
  }

  /**
   * Utility: Apply color codes if color support is enabled
   */
  colorize(color, text) {
    if (!this.colorSupport || !this.colors[color]) return text;
    return this.colors[color] + text + this.colors.reset;
  }

  /**
   * Export dashboard as JSON for external processing
   */
  exportToJson(healthData, outputPath) {
    const exportData = {
      ...healthData,
      exportedAt: new Date().toISOString(),
      format: 'vibespec-health-v1'
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
    return outputPath;
  }

  /**
   * Export dashboard as CSV for spreadsheet analysis
   */
  exportToCsv(healthData, outputPath) {
    const rows = [
      ['Dimension', 'Score', 'Status', 'Trend', 'Issues'],
      ['Overall', healthData.overallScore, this.getHealthStatus(healthData.overallScore).label, 
       healthData.trend?.change || 0, healthData.issues?.critical || 0]
    ];
    
    if (healthData.dimensions) {
      Object.entries(healthData.dimensions).forEach(([dim, data]) => {
        rows.push([
          dim,
          data.score || 0,
          this.getHealthStatus(data.score || 0).label,
          data.trend?.change || 0,
          data.issues || 0
        ]);
      });
    }
    
    const csvContent = rows.map(row => row.join(',')).join('\n');
    fs.writeFileSync(outputPath, csvContent);
    return outputPath;
  }
}

// CLI interface when run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const inputFile = args[0];
  
  if (!inputFile) {
    console.error('Usage: node dashboard-renderer.js <health-data.json> [options]');
    process.exit(1);
  }
  
  try {
    const healthData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const renderer = new HealthDashboardRenderer();
    
    console.log(renderer.renderHealthDashboard(healthData));
  } catch (error) {
    console.error('Error rendering dashboard:', error.message);
    process.exit(1);
  }
}

module.exports = HealthDashboardRenderer;