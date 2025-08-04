#!/usr/bin/env node
/**
 * VibeSpec Health Command Integration
 * 
 * Integration script that demonstrates how the /vibespec:health command
 * coordinates with the health dashboard system for comprehensive project assessment.
 */

const HealthIntegrationUtils = require('./integration-utils');
const HealthDashboardRenderer = require('./dashboard-renderer');
const HealthReportTemplates = require('./report-templates');

class VibeSpecHealthCommand {
  constructor(options = {}) {
    this.integration = new HealthIntegrationUtils(options);
    this.renderer = new HealthDashboardRenderer(options);
    this.templates = new HealthReportTemplates(options);
    this.performanceTarget = 10000; // 10 seconds max
  }

  /**
   * Main entry point for /vibespec:health command
   */
  async execute(flags = {}) {
    const startTime = Date.now();
    
    try {
      console.log(this.renderer.colorize('bold', '🏥 VIBESPEC HEALTH ASSESSMENT'));
      console.log('Collecting project metrics...\n');
      
      // Phase 1: Collect comprehensive metrics
      const metrics = await this.integration.collectHealthMetrics();
      
      // Phase 2: Calculate health scores
      const healthAssessment = this.integration.calculateHealthScore(metrics);
      
      // Phase 3: Generate trend analysis if history available
      const history = await this.loadHealthHistory();
      if (history.length > 0) {
        healthAssessment.history = history;
        healthAssessment.trend = this.calculateTrendFromHistory(history, healthAssessment.overallScore);
      }
      
      // Phase 4: Update history log
      await this.integration.updateHealthHistory(healthAssessment.overallScore, healthAssessment.dimensions);
      
      // Phase 5: Generate output based on flags
      const duration = Date.now() - startTime;
      healthAssessment.metadata = {
        timestamp: new Date().toISOString(),
        duration,
        nextCheck: this.calculateNextCheckRecommendation(healthAssessment.overallScore)
      };
      
      return await this.generateOutput(healthAssessment, flags, duration);
      
    } catch (error) {
      console.error(`❌ Health assessment failed: ${error.message}`);
      if (flags.verbose) {
        console.error(error.stack);
      }
      return this.generateErrorOutput(error);
    }
  }

  /**
   * Generate appropriate output based on command flags
   */
  async generateOutput(healthData, flags, duration) {
    // Performance warning if over target
    if (duration > this.performanceTarget) {
      console.warn(`⚠️  Health check took ${duration}ms (target: <${this.performanceTarget}ms)`);
    }

    // Default dashboard output
    if (!flags.detailed && !flags.export && !flags.history) {
      const dashboard = this.renderer.renderHealthDashboard(healthData);
      console.log(dashboard);
      
      // Quick recommendations
      if (healthData.recommendations && healthData.recommendations.length > 0) {
        console.log('\n' + this.renderer.colorize('bold', '💡 QUICK ACTIONS:'));
        healthData.recommendations.slice(0, 3).forEach((rec, i) => {
          const priorityColor = rec.priority === 'high' ? 'critical' : 
                               rec.priority === 'medium' ? 'warning' : 'neutral';
          console.log(`${i + 1}. ${this.renderer.colorize(priorityColor, `[${rec.priority.toUpperCase()}]`)} ${rec.title}`);
        });
      }
      
      return healthData;
    }

    // Detailed report output
    if (flags.detailed) {
      const detailedReport = this.templates.generateDetailedTechnicalReport(healthData, {
        projectName: 'VibeSpec Project',
        includePerformanceMetrics: true
      });
      
      console.log(detailedReport);
      
      if (flags.export) {
        await this.exportDetailedReport(detailedReport, healthData);
      }
      
      return { healthData, report: detailedReport };
    }

    // History analysis
    if (flags.history) {
      return await this.generateHistoryAnalysis(healthData, flags);
    }

    // Export only
    if (flags.export) {
      return await this.exportHealthData(healthData, flags);
    }

    return healthData;
  }

  /**
   * Generate comprehensive history analysis
   */
  async generateHistoryAnalysis(currentHealth, flags) {
    const history = await this.loadHealthHistory();
    const days = flags.days || 30;
    const recentHistory = history.slice(-days);
    
    console.log(this.renderer.colorize('bold', `📈 HEALTH TREND ANALYSIS (${days} days)`));
    console.log('═'.repeat(60));
    
    if (recentHistory.length < 2) {
      console.log('Insufficient historical data for trend analysis.');
      console.log('Run health checks regularly to build trend history.\n');
      return currentHealth;
    }

    // Overall trend visualization
    const scores = recentHistory.map(h => h.overallScore);
    const trendChart = this.generateTrendChart(scores, recentHistory.map(h => h.timestamp));
    console.log('\nOverall Health Trend:');
    console.log(trendChart);

    // Dimensional trends
    console.log('\nDimensional Trends:');
    const dimensions = ['compliance', 'velocity', 'specAlignment', 'codeQuality', 'architecture'];
    
    dimensions.forEach(dimension => {
      const dimScores = recentHistory
        .map(h => h.dimensions?.[dimension]?.score || 0)
        .filter(score => score > 0);
      
      if (dimScores.length > 1) {
        const sparkline = this.generateSparkline(dimScores);
        const trend = this.calculateSimpleTrend(dimScores);
        const trendSymbol = trend > 0 ? '↗' : trend < 0 ? '↘' : '→';
        
        console.log(`  ${dimension.padEnd(15)}: ${sparkline} ${trendSymbol}`);
      }
    });

    // Health insights
    console.log('\n' + this.renderer.colorize('bold', '🔍 INSIGHTS:'));
    
    const insights = this.generateTrendInsights(recentHistory, currentHealth);
    insights.forEach(insight => {
      console.log(`  • ${insight}`);
    });

    // Predictions
    if (recentHistory.length >= 7) {
      console.log('\n' + this.renderer.colorize('bold', '🔮 PREDICTIONS:'));
      const predictions = this.generatePredictions(recentHistory);
      predictions.forEach(prediction => {
        console.log(`  • ${prediction}`);
      });
    }

    return { currentHealth, history: recentHistory, insights, predictions: predictions || [] };
  }

  /**
   * Export health data in various formats
   */
  async exportHealthData(healthData, flags) {
    const format = flags.format || 'json';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = require('path').join(process.cwd(), '.claude', 'health', 'output');
    
    // Ensure output directory exists
    require('fs').mkdirSync(outputDir, { recursive: true });
    
    let exportPath;
    
    switch (format.toLowerCase()) {
      case 'json':
        exportPath = require('path').join(outputDir, `health-${timestamp}.json`);
        this.renderer.exportToJson(healthData, exportPath);
        break;
        
      case 'csv':
        exportPath = require('path').join(outputDir, `health-${timestamp}.csv`);
        this.renderer.exportToCsv(healthData, exportPath);
        break;
        
      case 'markdown':
        exportPath = require('path').join(outputDir, `health-report-${timestamp}.md`);
        const report = this.templates.generateExecutiveSummary(healthData);
        require('fs').writeFileSync(exportPath, report);
        break;
        
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
    console.log(`📁 Health data exported to: ${exportPath}`);
    return { healthData, exportPath };
  }

  /**
   * Export detailed report
   */
  async exportDetailedReport(report, healthData) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = require('path').join(process.cwd(), '.claude', 'health', 'output');
    const reportPath = require('path').join(outputDir, `detailed-health-report-${timestamp}.md`);
    
    require('fs').writeFileSync(reportPath, report);
    console.log(`📋 Detailed report saved to: ${reportPath}`);
    
    // Also export raw data
    const dataPath = require('path').join(outputDir, `health-data-${timestamp}.json`);
    this.renderer.exportToJson(healthData, dataPath);
    
    return { reportPath, dataPath };
  }

  /**
   * Generate error output for failed assessments
   */
  generateErrorOutput(error) {
    const errorReport = `# Health Assessment Error

**Timestamp**: ${new Date().toISOString()}
**Error**: ${error.message}

## Recommended Actions

1. **Check project structure**: Ensure you're in a VibeSpec project directory
2. **Verify dependencies**: Run \`npm install\` to ensure all dependencies are available
3. **Check permissions**: Ensure read access to project files and .claude directory
4. **Retry assessment**: Run \`/vibespec:health\` again after addressing issues

## Error Details

\`\`\`
${error.stack || error.message}
\`\`\`

If the error persists, consider running with \`--verbose\` flag for detailed debugging information.
`;

    console.log(errorReport);
    return { error: error.message, timestamp: new Date().toISOString() };
  }

  // Helper methods for analysis and visualization

  async loadHealthHistory() {
    try {
      const historyPath = require('path').join(process.cwd(), '.claude', 'logs', 'health-history.json');
      if (require('fs').existsSync(historyPath)) {
        const history = JSON.parse(require('fs').readFileSync(historyPath, 'utf8'));
        return Array.isArray(history) ? history : [];
      }
    } catch (error) {
      console.warn('Could not load health history:', error.message);
    }
    return [];
  }

  calculateTrendFromHistory(history, currentScore) {
    if (history.length < 2) return { change: 0 };
    
    const recent = history.slice(-3);
    const older = history.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) return { change: 0 };
    
    const recentAvg = recent.reduce((sum, h) => sum + h.overallScore, 0) / recent.length;
    const olderAvg = older.reduce((sum, h) => sum + h.overallScore, 0) / older.length;
    
    return { change: recentAvg - olderAvg };
  }

  generateTrendChart(scores, timestamps) {
    const width = 50;
    const height = 8;
    
    // Simple ASCII line chart
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const range = max - min || 1;
    
    const chart = Array(height).fill().map(() => Array(width).fill(' '));
    
    scores.forEach((score, i) => {
      const x = Math.floor((i / (scores.length - 1)) * (width - 1));
      const y = height - 1 - Math.floor(((score - min) / range) * (height - 1));
      
      if (x >= 0 && x < width && y >= 0 && y < height) {
        chart[y][x] = '●';
      }
    });
    
    const chartLines = chart.map(row => row.join(''));
    const baseline = `${min.toFixed(0).padStart(3)} ├${'─'.repeat(width - 4)}┤ ${max.toFixed(0)}`;
    
    return chartLines.join('\n') + '\n' + baseline;
  }

  generateSparkline(data) {
    const symbols = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    return data.map(value => {
      const normalized = (value - min) / range;
      const index = Math.floor(normalized * (symbols.length - 1));
      return symbols[index];
    }).join('');
  }

  calculateSimpleTrend(data) {
    if (data.length < 2) return 0;
    const recent = data.slice(-3);
    const older = data.slice(0, 3);
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
    
    return recentAvg - olderAvg;
  }

  generateTrendInsights(history, currentHealth) {
    const insights = [];
    
    // Overall trend
    const scores = history.map(h => h.overallScore);
    const trend = this.calculateSimpleTrend(scores);
    
    if (trend > 5) {
      insights.push('Health is showing strong improvement over time');
    } else if (trend < -5) {
      insights.push('Health has been declining - investigate recent changes');
    } else {
      insights.push('Health trend is stable with minor fluctuations');
    }
    
    // Velocity insights
    const velocityScores = history.map(h => h.dimensions?.velocity?.score || 0).filter(s => s > 0);
    if (velocityScores.length > 2) {
      const velocityTrend = this.calculateSimpleTrend(velocityScores);
      if (velocityTrend < -3) {
        insights.push('Development velocity has slowed - consider process improvements');
      } else if (velocityTrend > 3) {
        insights.push('Development velocity is accelerating - good momentum');
      }
    }
    
    // Compliance insights
    if (currentHealth.issues?.critical > 0) {
      insights.push(`${currentHealth.issues.critical} critical issues need immediate attention`);
    }
    
    // Quality insights
    const qualityScores = history.map(h => h.dimensions?.codeQuality?.score || 0).filter(s => s > 0);
    if (qualityScores.length > 2) {
      const qualityTrend = this.calculateSimpleTrend(qualityScores);
      if (qualityTrend > 5) {
        insights.push('Code quality improvements are paying off');
      } else if (qualityTrend < -5) {
        insights.push('Code quality may be degrading - review recent changes');
      }
    }
    
    return insights;
  }

  generatePredictions(history) {
    const predictions = [];
    const scores = history.map(h => h.overallScore);
    
    // Simple linear trend prediction
    if (scores.length >= 7) {
      const trend = this.calculateSimpleTrend(scores);
      const currentScore = scores[scores.length - 1];
      const predicted7Day = Math.max(0, Math.min(100, currentScore + (trend * 7)));
      
      predictions.push(`7-day forecast: Health score likely to be around ${Math.round(predicted7Day)}/100`);
      
      if (trend < -3) {
        predictions.push('Declining trend detected - recommend immediate intervention');
      } else if (trend > 3) {
        predictions.push('Positive trend continuing - maintain current practices');
      }
    }
    
    // Risk assessment
    const criticalIssues = history[history.length - 1]?.issues?.critical || 0;
    if (criticalIssues > 0) {
      predictions.push('Critical issues present - project deployment risk is elevated');
    }
    
    return predictions;
  }

  calculateNextCheckRecommendation(score) {
    if (score < 60) return 'within 24 hours';
    if (score < 75) return 'within 3 days';
    if (score < 90) return 'within 1 week';
    return 'within 2 weeks';
  }
}

// CLI interface for direct execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  // Parse flags
  const flags = {};
  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      flags[key] = value || true;
    }
  });
  
  const healthCommand = new VibeSpecHealthCommand();
  
  healthCommand.execute(flags).then(result => {
    if (flags.verbose) {
      console.log('\n📊 Assessment completed successfully');
    }
  }).catch(error => {
    console.error(`❌ Health command failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = VibeSpecHealthCommand;