#!/usr/bin/env node
/**
 * VibeSpec Health Visualization Components
 * 
 * Modular ASCII visualization components for building custom health dashboards
 * with consistent styling, color support, and terminal responsiveness.
 */

class VisualizationComponents {
  constructor(options = {}) {
    this.terminalWidth = options.terminalWidth || process.stdout.columns || 80;
    this.colorSupport = options.colorSupport !== false && process.stdout.isTTY;
    this.unicodeSupport = options.unicodeSupport !== false;
    this.theme = options.theme || 'default';
    
    this.initializeTheme();
  }

  initializeTheme() {
    const themes = {
      default: {
        colors: {
          critical: '\x1b[91m',
          warning: '\x1b[93m',
          good: '\x1b[92m',
          excellent: '\x1b[96m',
          neutral: '\x1b[37m',
          reset: '\x1b[0m',
          bold: '\x1b[1m',
          dim: '\x1b[2m'
        },
        symbols: {
          filled: this.unicodeSupport ? '█' : '#',
          empty: this.unicodeSupport ? '░' : '-',
          spark: this.unicodeSupport ? ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'] : ['_', '.', ':', ';', '|', '!', 'I', '#'],
          box: {
            horizontal: this.unicodeSupport ? '─' : '-',
            vertical: this.unicodeSupport ? '│' : '|',
            topLeft: this.unicodeSupport ? '┌' : '+',
            topRight: this.unicodeSupport ? '┐' : '+',
            bottomLeft: this.unicodeSupport ? '└' : '+',
            bottomRight: this.unicodeSupport ? '┘' : '+',
            cross: this.unicodeSupport ? '┼' : '+',
            teeDown: this.unicodeSupport ? '┬' : '+',
            teeUp: this.unicodeSupport ? '┴' : '+',
            teeLeft: this.unicodeSupport ? '┤' : '+',
            teeRight: this.unicodeSupport ? '├' : '+'
          }
        }
      },
      minimal: {
        colors: {
          critical: '',
          warning: '',
          good: '',
          excellent: '',
          neutral: '',
          reset: '',
          bold: '',
          dim: ''
        },
        symbols: {
          filled: '#',
          empty: '-',
          spark: ['_', '.', ':', ';', '|', '!', 'I', '#'],
          box: {
            horizontal: '-',
            vertical: '|',
            topLeft: '+',
            topRight: '+',
            bottomLeft: '+',
            bottomRight: '+',
            cross: '+',
            teeDown: '+',
            teeUp: '+',
            teeLeft: '+',
            teeRight: '+'
          }
        }
      }
    };

    const selectedTheme = themes[this.theme] || themes.default;
    this.colors = selectedTheme.colors;
    this.symbols = selectedTheme.symbols;
  }

  /**
   * Create horizontal progress bar with customizable styling
   */
  createProgressBar(value, max = 100, options = {}) {
    const width = options.width || 20;
    const showPercentage = options.showPercentage !== false;
    const showValue = options.showValue || false;
    const label = options.label || '';
    const style = options.style || 'filled';
    
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const filledWidth = Math.round((percentage / 100) * width);
    const emptyWidth = width - filledWidth;
    
    let bar;
    switch (style) {
      case 'gradient':
        bar = this.createGradientBar(filledWidth, emptyWidth, percentage);
        break;
      case 'segmented':
        bar = this.createSegmentedBar(filledWidth, emptyWidth, width);
        break;
      case 'minimal':
        bar = '='.repeat(filledWidth) + ' '.repeat(emptyWidth);
        break;
      default:
        bar = this.symbols.filled.repeat(filledWidth) + this.symbols.empty.repeat(emptyWidth);
    }
    
    const status = this.getHealthStatus(percentage);
    const colorizedBar = this.colorize(status.color, bar);
    
    let result = colorizedBar;
    
    if (label) {
      result = `${label}: ${result}`;
    }
    
    if (showPercentage) {
      result += ` ${Math.round(percentage)}%`;
    }
    
    if (showValue) {
      result += ` (${value}/${max})`;
    }
    
    return result;
  }

  /**
   * Create vertical progress bar
   */
  createVerticalProgressBar(value, max = 100, options = {}) {
    const height = options.height || 10;
    const showScale = options.showScale || false;
    const label = options.label || '';
    
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const filledHeight = Math.round((percentage / 100) * height);
    const emptyHeight = height - filledHeight;
    
    const status = this.getHealthStatus(percentage);
    const lines = [];
    
    // Empty portion (top)
    for (let i = 0; i < emptyHeight; i++) {
      lines.push(this.symbols.empty);
    }
    
    // Filled portion (bottom)
    for (let i = 0; i < filledHeight; i++) {
      lines.push(this.colorize(status.color, this.symbols.filled));
    }
    
    if (showScale) {
      const scale = this.generateVerticalScale(max, height);
      return lines.map((line, i) => `${scale[i] || ' '} ${line}`).join('\n');
    }
    
    let result = lines.join('\n');
    
    if (label) {
      result += `\n${label}`;
    }
    
    return result;
  }

  /**
   * Create sparkline from data array
   */
  createSparkline(data, options = {}) {
    if (!data || data.length === 0) return '';
    
    const width = options.width || Math.min(30, data.length);
    const smooth = options.smooth || false;
    const showTrend = options.showTrend || false;
    
    // Sample data if needed
    let samples = data;
    if (data.length > width) {
      const step = data.length / width;
      samples = [];
      for (let i = 0; i < data.length; i += step) {
        samples.push(data[Math.floor(i)]);
      }
    }
    
    // Smooth data if requested
    if (smooth && samples.length > 2) {
      samples = this.smoothData(samples);
    }
    
    const min = Math.min(...samples);
    const max = Math.max(...samples);
    const range = max - min || 1;
    
    const sparkline = samples.map(value => {
      const normalized = (value - min) / range;
      const index = Math.floor(normalized * (this.symbols.spark.length - 1));
      return this.symbols.spark[index];
    }).join('');
    
    if (showTrend) {
      const trend = this.calculateTrend(samples);
      const trendIndicator = trend > 0 ? '↗' : trend < 0 ? '↘' : '→';
      return `${sparkline} ${trendIndicator}`;
    }
    
    return sparkline;
  }

  /**
   * Create multi-series line chart
   */
  createLineChart(datasets, options = {}) {
    const width = options.width || Math.min(60, this.terminalWidth - 20);
    const height = options.height || 15;
    const showAxes = options.showAxes !== false;
    const showLegend = options.showLegend !== false;
    const labels = options.labels || [];
    
    if (!datasets || datasets.length === 0) return 'No data available';
    
    // Normalize all datasets to same length
    const maxLength = Math.max(...datasets.map(d => d.data.length));
    const normalizedDatasets = datasets.map(dataset => ({
      ...dataset,
      data: this.normalizeDataLength(dataset.data, maxLength)
    }));
    
    // Find global min/max
    const allValues = normalizedDatasets.flatMap(d => d.data);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min || 1;
    
    // Create chart grid
    const chart = Array(height).fill().map(() => Array(width).fill(' '));
    
    // Plot each dataset
    normalizedDatasets.forEach((dataset, seriesIndex) => {
      const symbol = dataset.symbol || ['•', '○', '■', '□', '♦', '◊'][seriesIndex % 6];
      const color = dataset.color || ['good', 'warning', 'critical', 'excellent'][seriesIndex % 4];
      
      dataset.data.forEach((value, i) => {
        const x = Math.floor((i / (dataset.data.length - 1)) * (width - 1));
        const y = height - 1 - Math.floor(((value - min) / range) * (height - 1));
        
        if (x >= 0 && x < width && y >= 0 && y < height) {
          chart[y][x] = this.colorize(color, symbol);
        }
      });
    });
    
    let result = chart.map(row => row.join('')).join('\n');
    
    // Add axes if requested
    if (showAxes) {
      result = this.addAxesToChart(result, min, max, width, height, labels);
    }
    
    // Add legend if requested
    if (showLegend && datasets.length > 1) {
      result += '\n\n' + this.createLegend(normalizedDatasets);
    }
    
    return result;
  }

  /**
   * Create horizontal bar chart
   */
  createBarChart(data, options = {}) {
    const maxBarWidth = options.maxBarWidth || Math.min(40, this.terminalWidth - 30);
    const showValues = options.showValues !== false;
    const showPercentages = options.showPercentages || false;
    const sortBy = options.sortBy || null; // 'value', 'label', null
    
    if (!data || data.length === 0) return 'No data available';
    
    // Sort data if requested
    let sortedData = [...data];
    if (sortBy === 'value') {
      sortedData.sort((a, b) => b.value - a.value);
    } else if (sortBy === 'label') {
      sortedData.sort((a, b) => a.label.localeCompare(b.label));
    }
    
    const maxValue = Math.max(...sortedData.map(d => d.value));
    const maxLabelLength = Math.max(...sortedData.map(d => d.label.length));
    
    return sortedData.map(item => {
      const barWidth = Math.round((item.value / maxValue) * maxBarWidth);
      const status = this.getHealthStatus((item.value / maxValue) * 100);
      
      const bar = this.colorize(status.color, this.symbols.filled.repeat(barWidth));
      const paddedLabel = item.label.padEnd(maxLabelLength);
      
      let line = `${paddedLabel} ${bar}`;
      
      if (showValues) {
        line += ` ${item.value}`;
      }
      
      if (showPercentages) {
        const percentage = ((item.value / maxValue) * 100).toFixed(1);
        line += ` (${percentage}%)`;
      }
      
      return line;
    }).join('\n');
  }

  /**
   * Create status matrix/grid
   */
  createStatusMatrix(data, options = {}) {
    const columns = options.columns || Math.floor(Math.sqrt(data.length));
    const cellWidth = options.cellWidth || 8;
    const showLabels = options.showLabels !== false;
    
    if (!data || data.length === 0) return 'No data available';
    
    const rows = Math.ceil(data.length / columns);
    const matrix = [];
    
    for (let row = 0; row < rows; row++) {
      const matrixRow = [];
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        if (index < data.length) {
          const item = data[index];
          const status = this.getHealthStatus(item.value);
          const symbol = this.getStatusSymbol(item.value);
          const cell = this.colorize(status.color, symbol.padEnd(cellWidth));
          matrixRow.push(cell);
        } else {
          matrixRow.push(' '.repeat(cellWidth));
        }
      }
      matrix.push(matrixRow.join(''));
      
      // Add labels row if requested
      if (showLabels) {
        const labelRow = [];
        for (let col = 0; col < columns; col++) {
          const index = row * columns + col;
          if (index < data.length) {
            const label = data[index].label.substring(0, cellWidth - 1).padEnd(cellWidth);
            labelRow.push(this.colorize('dim', label));
          } else {
            labelRow.push(' '.repeat(cellWidth));
          }
        }
        matrix.push(labelRow.join(''));
      }
    }
    
    return matrix.join('\n');
  }

  /**
   * Create comparison chart
   */
  createComparisonChart(current, previous, labels, options = {}) {
    const maxBarWidth = options.maxBarWidth || Math.min(30, this.terminalWidth - 40);
    const showDelta = options.showDelta !== false;
    const showPercentChange = options.showPercentChange || false;
    
    if (!current || !previous || current.length !== previous.length) {
      return 'Invalid comparison data';
    }
    
    const maxValue = Math.max(...current, ...previous);
    const maxLabelLength = Math.max(...labels.map(l => l.length));
    
    return labels.map((label, index) => {
      const currentVal = current[index];
      const previousVal = previous[index];
      const delta = currentVal - previousVal;
      const percentChange = previousVal !== 0 ? ((delta / previousVal) * 100) : 0;
      
      // Current value bar
      const currentBarWidth = Math.round((currentVal / maxValue) * maxBarWidth);
      const currentStatus = this.getHealthStatus((currentVal / maxValue) * 100);
      const currentBar = this.colorize(currentStatus.color, this.symbols.filled.repeat(currentBarWidth));
      
      const paddedLabel = label.padEnd(maxLabelLength);
      let line = `${paddedLabel} ${currentBar} ${currentVal}`;
      
      if (showDelta) {
        const deltaColor = delta > 0 ? 'good' : delta < 0 ? 'critical' : 'neutral';
        const deltaSymbol = delta > 0 ? '+' : '';
        line += ` ${this.colorize(deltaColor, `${deltaSymbol}${delta.toFixed(1)}`)}`;
      }
      
      if (showPercentChange && percentChange !== 0) {
        const changeColor = percentChange > 0 ? 'good' : 'critical';
        const changeSymbol = percentChange > 0 ? '+' : '';
        line += ` ${this.colorize(changeColor, `(${changeSymbol}${percentChange.toFixed(1)}%)`)}`;
      }
      
      return line;
    }).join('\n');
  }

  /**
   * Create gauge/dial visualization
   */
  createGauge(value, max = 100, options = {}) {
    const size = options.size || 'medium'; // small, medium, large
    const showValue = options.showValue !== false;
    const label = options.label || '';
    const thresholds = options.thresholds || [25, 50, 75, 90];
    
    const gaugeConfigs = {
      small: { width: 15, height: 7 },
      medium: { width: 21, height: 10 },
      large: { width: 31, height: 15 }
    };
    
    const config = gaugeConfigs[size] || gaugeConfigs.medium;
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    
    // Create semi-circular gauge
    const gauge = this.createSemiCircularGauge(percentage, config, thresholds);
    
    let result = gauge;
    
    if (showValue) {
      const status = this.getHealthStatus(percentage);
      const valueText = `${value}/${max} (${Math.round(percentage)}%)`;
      result += `\n${' '.repeat(Math.floor((config.width - valueText.length) / 2))}${this.colorize(status.color, valueText)}`;
    }
    
    if (label) {
      result += `\n${' '.repeat(Math.floor((config.width - label.length) / 2))}${label}`;
    }
    
    return result;
  }

  /**
   * Create distribution histogram
   */
  createHistogram(data, options = {}) {
    const buckets = options.buckets || 10;
    const height = options.height || 10;
    const showStats = options.showStats || false;
    const orientation = options.orientation || 'vertical'; // vertical, horizontal
    
    if (!data || data.length === 0) return 'No data available';
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const bucketSize = (max - min) / buckets;
    const distribution = new Array(buckets).fill(0);
    
    // Populate buckets
    data.forEach(value => {
      const bucketIndex = Math.min(buckets - 1, Math.floor((value - min) / bucketSize));
      distribution[bucketIndex]++;
    });
    
    if (orientation === 'vertical') {
      return this.createVerticalHistogram(distribution, bucketSize, min, height, showStats);
    } else {
      return this.createHorizontalHistogram(distribution, bucketSize, min, height, showStats);
    }
  }

  // Helper Methods

  createGradientBar(filledWidth, emptyWidth, percentage) {
    const gradientSymbols = this.unicodeSupport ? 
      ['▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'] : 
      ['.', ':', ';', '|', 'I', '#'];
    
    const fullBlocks = Math.floor(filledWidth);
    const partialBlock = filledWidth - fullBlocks;
    
    let bar = this.symbols.filled.repeat(fullBlocks);
    
    if (partialBlock > 0 && fullBlocks < filledWidth) {
      const gradientIndex = Math.floor(partialBlock * gradientSymbols.length);
      bar += gradientSymbols[gradientIndex];
    }
    
    bar += this.symbols.empty.repeat(Math.max(0, emptyWidth - (partialBlock > 0 ? 1 : 0)));
    
    return bar;
  }

  createSegmentedBar(filledWidth, emptyWidth, totalWidth) {
    const segments = 5;
    const segmentSize = totalWidth / segments;
    let bar = '';
    
    for (let i = 0; i < segments; i++) {
      const segmentStart = i * segmentSize;
      const segmentEnd = (i + 1) * segmentSize;
      
      if (filledWidth >= segmentEnd) {
        bar += this.symbols.filled.repeat(Math.floor(segmentSize));
      } else if (filledWidth > segmentStart) {
        const partialFill = Math.floor(filledWidth - segmentStart);
        bar += this.symbols.filled.repeat(partialFill);
        bar += this.symbols.empty.repeat(Math.floor(segmentSize) - partialFill);
      } else {
        bar += this.symbols.empty.repeat(Math.floor(segmentSize));
      }
      
      if (i < segments - 1) bar += '|';
    }
    
    return bar;
  }

  smoothData(data) {
    if (data.length < 3) return data;
    
    const smoothed = [data[0]];
    
    for (let i = 1; i < data.length - 1; i++) {
      const avg = (data[i - 1] + data[i] + data[i + 1]) / 3;
      smoothed.push(avg);
    }
    
    smoothed.push(data[data.length - 1]);
    return smoothed;
  }

  calculateTrend(data) {
    if (data.length < 2) return 0;
    
    const start = data.slice(0, Math.ceil(data.length / 3));
    const end = data.slice(-Math.ceil(data.length / 3));
    
    const startAvg = start.reduce((sum, val) => sum + val, 0) / start.length;
    const endAvg = end.reduce((sum, val) => sum + val, 0) / end.length;
    
    return endAvg - startAvg;
  }

  normalizeDataLength(data, targetLength) {
    if (data.length === targetLength) return data;
    
    if (data.length > targetLength) {
      const step = data.length / targetLength;
      const result = [];
      for (let i = 0; i < data.length; i += step) {
        result.push(data[Math.floor(i)]);
      }
      return result;
    } else {
      const result = [...data];
      while (result.length < targetLength) {
        result.push(result[result.length - 1]);
      }
      return result;
    }
  }

  createSemiCircularGauge(percentage, config, thresholds) {
    const { width, height } = config;
    const centerX = Math.floor(width / 2);
    const centerY = height - 1;
    const radius = Math.min(centerX, centerY);
    
    const lines = Array(height).fill().map(() => Array(width).fill(' '));
    
    // Draw gauge arc
    for (let angle = 0; angle <= 180; angle += 5) {
      const radians = (angle * Math.PI) / 180;
      const x = Math.round(centerX + radius * Math.cos(radians));
      const y = Math.round(centerY - radius * Math.sin(radians));
      
      if (x >= 0 && x < width && y >= 0 && y < height) {
        const currentPercentage = (angle / 180) * 100;
        const color = this.getHealthStatus(currentPercentage).color;
        
        if (currentPercentage <= percentage) {
          lines[y][x] = this.colorize(color, '●');
        } else {
          lines[y][x] = this.colorize('dim', '○');
        }
      }
    }
    
    // Draw needle
    const needleAngle = (percentage / 100) * Math.PI;
    const needleLength = radius * 0.8;
    const needleX = Math.round(centerX + needleLength * Math.cos(needleAngle));
    const needleY = Math.round(centerY - needleLength * Math.sin(needleAngle));
    
    // Draw needle line
    this.drawLine(lines, centerX, centerY, needleX, needleY, this.colorize('bold', '─'));
    
    return lines.map(row => row.join('')).join('\n');
  }

  createVerticalHistogram(distribution, bucketSize, min, height, showStats) {
    const maxCount = Math.max(...distribution);
    const lines = [];
    
    // Draw histogram bars
    for (let row = height - 1; row >= 0; row--) {
      let line = '';
      distribution.forEach(count => {
        const barHeight = (count / maxCount) * height;
        line += barHeight > row ? this.symbols.filled : ' ';
      });
      lines.push(line);
    }
    
    // Add x-axis labels
    const labels = distribution.map((_, i) => {
      const bucketStart = min + (i * bucketSize);
      return bucketStart.toFixed(0).padStart(2);
    });
    lines.push(labels.join(''));
    
    if (showStats) {
      const total = distribution.reduce((sum, count) => sum + count, 0);
      const mean = distribution.reduce((sum, count, i) => sum + count * (min + (i + 0.5) * bucketSize), 0) / total;
      lines.push('');
      lines.push(`Total: ${total}, Mean: ${mean.toFixed(2)}`);
    }
    
    return lines.join('\n');
  }

  createHorizontalHistogram(distribution, bucketSize, min, maxBarWidth, showStats) {
    const maxCount = Math.max(...distribution);
    
    return distribution.map((count, i) => {
      const barWidth = Math.round((count / maxCount) * maxBarWidth);
      const bar = this.symbols.filled.repeat(barWidth);
      const bucketStart = min + (i * bucketSize);
      const bucketLabel = `${bucketStart.toFixed(1)}`.padStart(6);
      return `${bucketLabel} ${bar} ${count}`;
    }).join('\n');
  }

  drawLine(grid, x1, y1, x2, y2, symbol) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    
    let x = x1;
    let y = y1;
    
    while (true) {
      if (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
        grid[y][x] = symbol;
      }
      
      if (x === x2 && y === y2) break;
      
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  }

  generateVerticalScale(max, height) {
    const scale = [];
    for (let i = 0; i < height; i++) {
      const value = max * (1 - (i / (height - 1)));
      scale.push(value.toFixed(0).padStart(3));
    }
    return scale;
  }

  addAxesToChart(chart, min, max, width, height, labels) {
    const lines = chart.split('\n');
    
    // Add y-axis
    const yAxisLines = lines.map((line, i) => {
      const value = max - ((i / (height - 1)) * (max - min));
      const yLabel = value.toFixed(0).padStart(4);
      return `${yLabel} │${line}`;
    });
    
    // Add x-axis
    yAxisLines.push(`${'    '} ${'─'.repeat(width)}`);
    
    // Add x-axis labels if provided
    if (labels && labels.length > 0) {
      const labelLine = '     ';
      const stepSize = Math.floor(width / labels.length);
      labels.forEach((label, i) => {
        const position = i * stepSize;
        labelLine += ' '.repeat(Math.max(0, position - labelLine.length + 5)) + label.substring(0, stepSize - 1);
      });
      yAxisLines.push(labelLine);
    }
    
    return yAxisLines.join('\n');
  }

  createLegend(datasets) {
    return datasets.map((dataset, i) => {
      const symbol = dataset.symbol || ['•', '○', '■', '□'][i % 4];
      const color = dataset.color || 'neutral';
      const name = dataset.name || `Series ${i + 1}`;
      return `${this.colorize(color, symbol)} ${name}`;
    }).join('  ');
  }

  getHealthStatus(score) {
    if (score >= 90) return { color: 'excellent', label: 'EXCELLENT' };
    if (score >= 75) return { color: 'good', label: 'GOOD' };
    if (score >= 60) return { color: 'warning', label: 'NEEDS ATTENTION' };
    return { color: 'critical', label: 'CRITICAL' };
  }

  getStatusSymbol(value) {
    if (value >= 90) return '⬤';
    if (value >= 75) return '●';
    if (value >= 60) return '◐';
    return '○';
  }

  colorize(color, text) {
    if (!this.colorSupport || !this.colors[color]) return text;
    return this.colors[color] + text + this.colors.reset;
  }
}

module.exports = VisualizationComponents;