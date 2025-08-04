# VibeSpec Health Dashboard System

A comprehensive terminal-friendly health monitoring and visualization system for VibeSpec projects, designed to transform complex project metrics into intuitive, actionable dashboards with sub-second performance.

## 🏥 System Overview

The health dashboard system provides real-time project health assessment across five critical dimensions:

- **Compliance** (30% weight): VibeSpec rules adherence
- **Velocity** (25% weight): Shipping momentum and development pace  
- **Spec Alignment** (25% weight): Implementation fidelity to specifications
- **Code Quality** (15% weight): Technical quality and build health
- **Architecture** (5% weight): Structure integrity and conventions

## 📦 Components

### Core Modules

#### `dashboard-renderer.js`
The primary visualization engine that creates terminal-friendly ASCII dashboards:

```javascript
const HealthDashboardRenderer = require('./dashboard-renderer');
const renderer = new HealthDashboardRenderer();

const dashboard = renderer.renderHealthDashboard(healthData);
console.log(dashboard);
```

**Features:**
- Color-coded health indicators
- Unicode support with fallbacks
- Terminal width awareness
- Progress bars: `████████░░ 80%`
- Sparklines: `▁▂▄▅▇█▇▅▄▂`
- Status matrices and trend visualization

#### `report-templates.js`
Professional markdown report generation for stakeholder communication:

```javascript
const HealthReportTemplates = require('./report-templates');
const templates = new HealthReportTemplates();

const executiveReport = templates.generateExecutiveSummary(healthData);
const technicalReport = templates.generateDetailedTechnicalReport(healthData);
```

**Report Types:**
- Executive Summary
- Detailed Technical Analysis  
- Velocity Focus Reports
- Compliance Audit Reports
- Performance Benchmark Reports

#### `visualization-components.js`
Modular ASCII visualization components for custom dashboards:

```javascript
const VisualizationComponents = require('./visualization-components');
const viz = new VisualizationComponents();

const progressBar = viz.createProgressBar(85, 100, { label: 'Health Score' });
const sparkline = viz.createSparkline(dataArray, { showTrend: true });
const gauge = viz.createGauge(87, 100, { size: 'large' });
```

**Components:**
- Progress bars (horizontal/vertical)
- Sparklines with trend indicators
- Multi-series line charts
- Bar charts and histograms
- Status matrices
- Comparison charts
- Gauge visualizations

#### `dashboard-cli.js`
Command-line interface for health dashboard operations:

```bash
# Generate complete dashboard
node dashboard-cli.js dashboard

# Create executive report
node dashboard-cli.js report --type executive --output report.md

# Quick health status
node dashboard-cli.js quick

# Export data
node dashboard-cli.js export --format csv

# Show trend history
node dashboard-cli.js history --days 14

# Real-time monitoring
node dashboard-cli.js monitor --interval 30 --duration 600
```

#### `integration-utils.js`
Integration layer for seamless data collection and workflow integration:

```javascript
const HealthIntegrationUtils = require('./integration-utils');
const integration = new HealthIntegrationUtils();

const metrics = await integration.collectHealthMetrics();
const healthScore = integration.calculateHealthScore(metrics);
```

**Integration Features:**
- Git metrics collection (commits, branch status)
- Build system analysis (TypeScript, ESLint)
- File structure compliance checking
- Specification coverage analysis
- VibeSpec rules validation
- Performance metric collection

## 🚀 Quick Start

### 1. Generate Demo Dashboard

```bash
cd .claude/health
node dashboard-cli.js demo
```

This creates a sample dashboard showing all visualization capabilities:

```
🎭 DEMO HEALTH DASHBOARD
(Using simulated data for demonstration)
═══════════════════════════════════════════════════

Overall Health Score: 87/100 [GOOD]

████████████████████████████████████████████▌ 87% ↑ +2.3%

📊 DIMENSIONAL BREAKDOWN:
├── Compliance:        ████████████████████████████████████████▌ 92/100 ↑ +1.5%
├── Velocity:          ████████████████████████████████▌ 84/100 ↓ -1.2%
├── Spec Alignment:    ████████████████████████████████████████▌ 89/100 ↑ +3.1%
├── Code Quality:      ████████████████████████████████████▌ 85/100 ↑ +4.2%
└── Architecture:      ████████████████████████████████████████████▌ 95/100 → ±0%
```

### 2. Real Health Assessment

For actual project health assessment, ensure your project has health data:

```bash
# Collect real project metrics
node integration-utils.js collect

# Generate dashboard with real data
node dashboard-cli.js dashboard --input ../workflow-state/health-cache.json
```

### 3. Integration with /vibespec:health

The system integrates seamlessly with the `/vibespec:health` command:

```bash
# The health command automatically uses these visualization tools
/vibespec:health

# Or with specific options
/vibespec:health --detailed --export
```

## 🎨 Visualization Examples

### Progress Bars
```
Health Score: ████████████████████▌ 85% ✅
Build Status: ██████████████████████████████████████████████▌ 94% ↑ +5%
```

### Sparklines  
```
Trend (30d): ▁▂▃▄▅▆▇█▇▆▅▄▃▂▃▄▅▆▇ ↗ Improving
Velocity:    ▃▄▅▄▃▄▅▆▇▆▅▄▅▆▇▆▅▆▇ → Stable
```

### Gauges
```
        ○●●●●●●●●○○○○○○
      ○●●●●●●●●●●●●●●○○
    ○●●●●●●●●●●●●●●●●●○
   ○●●●●●●●●●●●●●●●●●●○
  ○●●●●●●●●●●●●●●●●●●●○
        87/100 (87%)
      Health Score
```

### Status Matrix
```
🟢 Auth   🟡 User   🟢 API    🔴 Test
🟢 Build  🟢 Lint   🟡 Docs   🟢 Deploy
```

## 📊 Data Flow

```
Project Files → Integration Utils → Health Metrics → Dashboard Renderer → Terminal Output
       ↓              ↓                  ↓               ↓
   Git Status    Compliance Check    Score Calculation  ASCII Art
   Build Status  Structure Analysis   Trend Analysis   Progress Bars
   File Structure Spec Coverage      Issue Detection   Sparklines
```

## ⚡ Performance Features

### Sub-Second Rendering
- **Target**: All dashboards render in <1 second
- **Optimization**: Parallel metric collection, efficient algorithms
- **Caching**: Intelligent caching of expensive computations

### Terminal Compatibility
- **Width Awareness**: Adapts to terminal width (80-200 columns)
- **Color Detection**: Automatic color support detection
- **Unicode Fallbacks**: ASCII alternatives for limited terminals
- **Theme Support**: Multiple visual themes (default, minimal)

### Memory Efficiency
- **Streaming**: Large datasets processed in chunks
- **Cleanup**: Automatic memory cleanup after rendering
- **Limits**: Configurable data limits for performance

## 🔧 Configuration

### Environment Variables
```bash
export VIBESPEC_HEALTH_TERMINAL_WIDTH=120
export VIBESPEC_HEALTH_COLOR_SUPPORT=true
export VIBESPEC_HEALTH_UNICODE_SUPPORT=true
export VIBESPEC_HEALTH_THEME=default
```

### Custom Themes
```javascript
const customTheme = {
  colors: {
    critical: '\x1b[91m',
    warning: '\x1b[93m',
    good: '\x1b[92m',
    excellent: '\x1b[96m'
  },
  symbols: {
    filled: '█',
    empty: '░',
    spark: ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']
  }
};

const renderer = new HealthDashboardRenderer({ theme: customTheme });
```

## 📋 CLI Commands Reference

### Dashboard Generation
```bash
# Basic dashboard
node dashboard-cli.js dashboard

# Dashboard with custom input
node dashboard-cli.js dashboard --input health-data.json --output dashboard.txt

# Dashboard with verbose timing
node dashboard-cli.js dashboard --verbose
```

### Report Generation
```bash
# Executive summary
node dashboard-cli.js report --type executive

# Technical analysis
node dashboard-cli.js report --type technical --output analysis.md

# Velocity report
node dashboard-cli.js report --type velocity --period "Last Sprint"

# Compliance audit
node dashboard-cli.js report --type compliance --output audit.md
```

### Data Export
```bash
# Export to JSON
node dashboard-cli.js export --format json --output health-export.json

# Export to CSV for spreadsheet analysis
node dashboard-cli.js export --format csv --output metrics.csv

# Export as markdown report
node dashboard-cli.js export --format markdown --output report.md
```

### History and Trends
```bash
# Show last 7 days
node dashboard-cli.js history

# Show last 30 days
node dashboard-cli.js history --days 30

# Compare with previous state
node dashboard-cli.js compare --period "last week"
```

### Real-time Monitoring
```bash
# Monitor for 5 minutes, update every 15 seconds
node dashboard-cli.js monitor --interval 15 --duration 300

# Continuous monitoring (until Ctrl+C)
node dashboard-cli.js monitor --interval 30 --duration 0
```

## 🔗 Integration Points

### VibeSpec Health Command
The dashboard system integrates directly with `/vibespec:health`:

```bash
/vibespec:health          # Uses dashboard-renderer for output
/vh --detailed            # Uses report-templates for detailed analysis
/health --export          # Uses export functionality
```

### Agent Coordination
Works with specialized VibeSpec agents:

- **vibespec-health-engineer**: Orchestrates health assessment
- **compliance**: Validates VibeSpec rules  
- **spec-guardian**: Checks specification alignment
- **velocity**: Analyzes shipping momentum
- **reviewer**: Assesses code quality

### Workflow Integration
```bash
/workflow:validate        # Includes health dashboard in validation
/workflow:review          # Uses health metrics for context
/session:update           # Logs health snapshots
```

### Data Persistence
```
.claude/
├── workflow-state/
│   └── health-cache.json        # Current metrics cache
├── logs/
│   └── health-history.json      # Historical health data
└── health/
    └── output/                  # Generated reports and exports
```

## 🎯 Advanced Usage

### Custom Visualization Components
```javascript
const VisualizationComponents = require('./visualization-components');
const viz = new VisualizationComponents({ theme: 'minimal' });

// Custom progress bar with segments
const segmentedBar = viz.createProgressBar(85, 100, {
  style: 'segmented',
  width: 30,
  label: 'Build Health'
});

// Multi-series line chart
const lineChart = viz.createLineChart([
  { name: 'Health', data: healthScores, color: 'good' },
  { name: 'Velocity', data: velocityScores, color: 'warning' }
], { height: 15, showLegend: true });

// Distribution histogram
const histogram = viz.createHistogram(responseTimeData, {
  buckets: 12,
  orientation: 'horizontal',
  showStats: true
});
```

### Custom Report Templates
```javascript
const HealthReportTemplates = require('./report-templates');
const templates = new HealthReportTemplates();

// Custom report with specific focus
const customReport = templates.generateExecutiveSummary(healthData, {
  period: 'Q1 2024',
  projectName: 'Enterprise Dashboard',
  focus: ['velocity', 'compliance']
});

// Velocity-specific analysis
const velocityAnalysis = templates.generateVelocityReport(velocityData, {
  period: 'Last Sprint',
  includeForecasting: true
});
```

### Performance Monitoring
```javascript
const HealthIntegrationUtils = require('./integration-utils');
const integration = new HealthIntegrationUtils();

// Benchmark data collection performance
const startTime = Date.now();
const metrics = await integration.collectHealthMetrics();
const collectionTime = Date.now() - startTime;

console.log(`Metrics collected in ${collectionTime}ms`);

// Generate performance report
const performanceData = {
  collectionTime,
  processingTime: metrics.collectionDuration,
  totalMetrics: Object.keys(metrics).length
};

const performanceReport = templates.generatePerformanceReport(performanceData);
```

## 🚀 Future Enhancements

### Planned Features
- **Interactive Dashboards**: Terminal-based interactive navigation
- **Real-time Streaming**: Live metric updates during development
- **Machine Learning**: Predictive health modeling and anomaly detection
- **Team Analytics**: Multi-developer health correlation analysis
- **Custom Metrics**: User-defined health dimensions and scoring

### Performance Targets
- **<500ms**: Standard dashboard generation
- **<2s**: Comprehensive technical reports
- **<10s**: Full historical analysis with trends
- **<100MB**: Memory usage for large projects

### Integration Roadmap
- **CI/CD Integration**: Automated health checks in pipelines
- **IDE Plugins**: Real-time health status in development environments  
- **Slack/Discord**: Health alerts and summaries in team channels
- **GitHub Integration**: Health status in pull request checks

## 🤝 Contributing

The health dashboard system is designed for extensibility:

### Adding New Visualizations
1. Extend `VisualizationComponents` class
2. Follow ASCII art patterns and color schemes
3. Ensure terminal width responsiveness
4. Add unit tests for new components

### Custom Health Metrics
1. Extend `HealthIntegrationUtils` for data collection
2. Update scoring algorithms in calculation methods
3. Add visualization support in dashboard renderer
4. Document new metrics in this README

### Performance Optimization
1. Profile with large datasets (>10k files)
2. Optimize data collection parallelization  
3. Implement intelligent caching strategies
4. Benchmark against performance targets

The system provides a solid foundation for comprehensive project health monitoring while maintaining the speed and simplicity that VibeSpec developers expect.