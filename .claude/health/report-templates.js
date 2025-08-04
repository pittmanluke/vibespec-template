#!/usr/bin/env node
/**
 * VibeSpec Health Report Templates
 * 
 * Professional markdown report generation system with customizable templates
 * for executive summaries, technical analysis, and stakeholder communication.
 */

const fs = require('fs');
const path = require('path');

class HealthReportTemplates {
  constructor(options = {}) {
    this.dateFormat = options.dateFormat || 'en-US';
    this.timezone = options.timezone || 'UTC';
    this.includeCharts = options.includeCharts !== false;
  }

  /**
   * Generate Executive Summary Report
   */
  generateExecutiveSummary(healthData, options = {}) {
    const template = `# Project Health Executive Summary

**Generated**: ${this.formatDate(new Date())}  
**Period**: ${options.period || 'Current State'}  
**Overall Health**: ${healthData.overallScore}/100 (${this.getHealthStatus(healthData.overallScore).label})

## 🎯 Key Performance Indicators

| Metric | Current | Target | Trend | Status |
|--------|---------|--------|-------|--------|
${this.generateKpiTable(healthData)}

## 📊 Health Score Breakdown

${this.generateHealthBreakdown(healthData)}

## 🚨 Critical Insights

${this.generateCriticalInsights(healthData)}

## ⚡ Action Required

${this.generateActionItems(healthData.recommendations)}

## 📈 Performance Trends

${this.generateTrendSummary(healthData.history)}

---
*Next health assessment recommended: ${this.calculateNextCheck(healthData)}*
`;

    return template;
  }

  /**
   * Generate Detailed Technical Report
   */
  generateDetailedTechnicalReport(healthData, options = {}) {
    const template = `# Detailed Health Analysis Report

**Analysis Date**: ${this.formatDate(new Date())}  
**Project**: ${options.projectName || 'VibeSpec Project'}  
**Analysis Type**: Comprehensive Multi-Dimensional Assessment  
**Execution Time**: ${healthData.metadata?.duration || 'N/A'}ms

## 📋 Executive Summary

### Overall Health Assessment
- **Health Score**: ${healthData.overallScore}/100
- **Health Status**: ${this.getHealthStatus(healthData.overallScore).label}
- **Trend Direction**: ${this.getTrendDirection(healthData.trend)}
- **Risk Level**: ${this.calculateRiskLevel(healthData)}

### Key Findings
${this.generateKeyFindings(healthData)}

## 📊 Dimensional Analysis

${this.generateDimensionalAnalysis(healthData.dimensions)}

## 🔍 Compliance Analysis

${this.generateComplianceAnalysis(healthData.compliance)}

## 🚀 Velocity Analysis

${this.generateVelocityAnalysis(healthData.velocity)}

## 📋 Specification Alignment

${this.generateSpecificationAnalysis(healthData.specAlignment)}

## 🔧 Code Quality Assessment

${this.generateCodeQualityAnalysis(healthData.codeQuality)}

## 🏗️ Architecture Integrity

${this.generateArchitectureAnalysis(healthData.architecture)}

## 📈 Historical Trends

${this.generateHistoricalAnalysis(healthData.history)}

## 🎯 Recommendations

${this.generateDetailedRecommendations(healthData.recommendations)}

## 📊 Performance Metrics

${this.generatePerformanceMetrics(healthData.performance)}

## 🔮 Predictive Insights

${this.generatePredictiveInsights(healthData)}

---

### Methodology
This analysis employs the VibeSpec Health Assessment Framework, utilizing weighted scoring across five critical dimensions with real-time metric aggregation and historical trend analysis.

### Data Sources
- Git commit history and branch analysis
- Build system outputs and performance metrics
- File structure and naming convention validation
- TypeScript compilation and linting results
- Specification coverage and implementation fidelity

### Next Steps
${this.generateNextSteps(healthData)}
`;

    return template;
  }

  /**
   * Generate Velocity Focus Report
   */
  generateVelocityReport(velocityData, options = {}) {
    const template = `# Development Velocity Analysis

**Analysis Period**: ${options.period || 'Last 30 Days'}  
**Generated**: ${this.formatDate(new Date())}  
**Current Velocity**: ${velocityData.currentVelocity || 'N/A'} features/week

## ⚡ Velocity Overview

### Current Metrics
- **Sprint Velocity**: ${velocityData.sprintVelocity || 'N/A'} story points
- **Feature Completion Rate**: ${velocityData.featureCompletionRate || 'N/A'}%
- **Commit Frequency**: ${velocityData.commitFrequency || 'N/A'} commits/day
- **Build Success Rate**: ${velocityData.buildSuccessRate || 'N/A'}%
- **Time to Deploy**: ${velocityData.timeTodeploy || 'N/A'} hours

### Velocity Trends
${this.generateVelocityTrends(velocityData.history)}

## 🚧 Bottleneck Analysis

${this.generateBottleneckAnalysis(velocityData.bottlenecks)}

## 📊 Performance Metrics

| Metric | Current | Target | Performance |
|--------|---------|--------|-------------|
${this.generateVelocityMetricsTable(velocityData)}

## 🎯 Velocity Optimization

${this.generateVelocityOptimization(velocityData.recommendations)}

## 📈 Predictive Modeling

${this.generateVelocityPredictions(velocityData)}

## 🔧 Process Improvements

${this.generateProcessImprovements(velocityData.processMetrics)}
`;

    return template;
  }

  /**
   * Generate Compliance Audit Report
   */
  generateComplianceReport(complianceData, options = {}) {
    const template = `# VibeSpec Compliance Audit Report

**Audit Date**: ${this.formatDate(new Date())}  
**Compliance Score**: ${complianceData.overallScore}/100  
**Rules Assessed**: ${complianceData.totalRules || 12} VibeSpec Rules

## 📋 Compliance Summary

### Overall Assessment
- **Compliance Rate**: ${((complianceData.passedRules / complianceData.totalRules) * 100).toFixed(1)}%
- **Passed Rules**: ${complianceData.passedRules}/${complianceData.totalRules}
- **Critical Violations**: ${complianceData.criticalViolations || 0}
- **Warnings**: ${complianceData.warnings || 0}

## 🔍 Rule-by-Rule Analysis

${this.generateRuleAnalysis(complianceData.rules)}

## 🚨 Critical Issues

${this.generateCriticalIssues(complianceData.criticalIssues)}

## ⚠️ Warnings and Recommendations

${this.generateWarningsAndRecommendations(complianceData.warnings)}

## 📈 Compliance Trends

${this.generateComplianceTrends(complianceData.history)}

## 🔧 Remediation Plan

${this.generateRemediationPlan(complianceData.remediation)}
`;

    return template;
  }

  /**
   * Generate Performance Benchmark Report
   */
  generatePerformanceReport(performanceData, options = {}) {
    const template = `# Performance Benchmark Report

**Benchmark Date**: ${this.formatDate(new Date())}  
**Baseline**: ${options.baseline || 'Project Creation'}  
**Measurement Period**: ${options.period || 'Last 7 Days'}

## ⚡ Performance Overview

### Current Performance
- **Health Check Speed**: ${performanceData.healthCheckSpeed || 'N/A'}ms
- **Build Time**: ${performanceData.buildTime || 'N/A'}s
- **Lint Execution**: ${performanceData.lintTime || 'N/A'}ms
- **Type Check**: ${performanceData.typeCheckTime || 'N/A'}ms

### Performance Trends
${this.generatePerformanceTrends(performanceData.history)}

## 📊 Benchmark Comparison

${this.generateBenchmarkComparison(performanceData.benchmarks)}

## 🎯 Performance Targets

${this.generatePerformanceTargets(performanceData.targets)}

## 🔧 Optimization Opportunities

${this.generateOptimizationOpportunities(performanceData.optimizations)}
`;

    return template;
  }

  // Helper Methods for Template Generation

  generateKpiTable(healthData) {
    const kpis = [
      { metric: 'Overall Health', current: `${healthData.overallScore}/100`, target: '90+', trend: this.getTrendSymbol(healthData.trend), status: this.getStatusSymbol(healthData.overallScore) },
      { metric: 'Compliance', current: `${healthData.dimensions?.compliance?.score || 'N/A'}/100`, target: '95+', trend: this.getTrendSymbol(healthData.dimensions?.compliance?.trend), status: this.getStatusSymbol(healthData.dimensions?.compliance?.score) },
      { metric: 'Velocity', current: `${healthData.dimensions?.velocity?.score || 'N/A'}/100`, target: '80+', trend: this.getTrendSymbol(healthData.dimensions?.velocity?.trend), status: this.getStatusSymbol(healthData.dimensions?.velocity?.score) },
      { metric: 'Code Quality', current: `${healthData.dimensions?.codeQuality?.score || 'N/A'}/100`, target: '85+', trend: this.getTrendSymbol(healthData.dimensions?.codeQuality?.trend), status: this.getStatusSymbol(healthData.dimensions?.codeQuality?.score) }
    ];

    return kpis.map(kpi => 
      `| ${kpi.metric} | ${kpi.current} | ${kpi.target} | ${kpi.trend} | ${kpi.status} |`
    ).join('\n');
  }

  generateHealthBreakdown(healthData) {
    if (!healthData.dimensions) {
      return 'Dimensional data not available.';
    }

    return Object.entries(healthData.dimensions).map(([dimension, data]) => {
      const score = data.score || 0;
      const progressBar = this.generateMarkdownProgressBar(score);
      return `### ${this.capitalizeWords(dimension)}: ${score}/100\n${progressBar}`;
    }).join('\n\n');
  }

  generateCriticalInsights(healthData) {
    const insights = [];
    
    // Overall health insight
    if (healthData.overallScore < 70) {
      insights.push('🔴 **Critical**: Overall project health requires immediate attention');
    } else if (healthData.overallScore >= 90) {
      insights.push('🟢 **Excellent**: Project health is optimal');
    }

    // Critical issues
    if (healthData.issues?.critical > 0) {
      insights.push(`🚨 **${healthData.issues.critical} critical issues** need immediate resolution`);
    }

    // Trend insights
    if (healthData.trend?.change && healthData.trend.change < -5) {
      insights.push('📉 **Declining trend** detected - investigate recent changes');
    }

    return insights.length > 0 ? insights.map(insight => `- ${insight}`).join('\n') : 
           '✅ No critical insights - project health is stable';
  }

  generateActionItems(recommendations) {
    if (!recommendations || recommendations.length === 0) {
      return '✅ No immediate actions required - maintain current practices';
    }

    return recommendations.slice(0, 5).map((rec, index) => {
      const priority = rec.priority || 'medium';
      const priorityEmoji = priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢';
      return `${index + 1}. ${priorityEmoji} **[${priority.toUpperCase()}]** ${rec.title}`;
    }).join('\n');
  }

  generateTrendSummary(history) {
    if (!history || history.length < 2) {
      return 'Insufficient historical data for trend analysis.';
    }

    const recentScore = history[history.length - 1].overallScore;
    const previousScore = history[history.length - 2].overallScore;
    const change = recentScore - previousScore;
    
    const trendEmoji = change > 0 ? '📈' : change < 0 ? '📉' : '➡️';
    const trendDescription = change > 0 ? 'improving' : change < 0 ? 'declining' : 'stable';
    
    return `${trendEmoji} Health trend is **${trendDescription}** (${change > 0 ? '+' : ''}${change.toFixed(1)} points)`;
  }

  generateDimensionalAnalysis(dimensions) {
    if (!dimensions) {
      return 'Dimensional analysis data not available.';
    }

    return Object.entries(dimensions).map(([dimension, data]) => {
      const score = data.score || 0;
      const status = this.getHealthStatus(score);
      const progressBar = this.generateMarkdownProgressBar(score);
      
      let analysis = `### ${this.capitalizeWords(dimension)} (${score}/100)\n\n`;
      analysis += `**Status**: ${status.label}\n\n`;
      analysis += `${progressBar}\n\n`;
      
      if (data.issues && data.issues.length > 0) {
        analysis += `**Issues Identified**:\n`;
        analysis += data.issues.map(issue => `- ${issue}`).join('\n') + '\n\n';
      }
      
      if (data.recommendations && data.recommendations.length > 0) {
        analysis += `**Recommendations**:\n`;
        analysis += data.recommendations.map(rec => `- ${rec}`).join('\n') + '\n\n';
      }
      
      return analysis;
    }).join('\n');
  }

  generateComplianceAnalysis(complianceData) {
    if (!complianceData) {
      return 'Compliance analysis data not available.';
    }

    let analysis = `**Overall Compliance Score**: ${complianceData.score}/100\n\n`;
    
    if (complianceData.rules) {
      analysis += `### Rule Compliance Status\n\n`;
      complianceData.rules.forEach((rule, index) => {
        const status = rule.passed ? '✅' : '❌';
        analysis += `${status} **Rule ${index + 1}**: ${rule.name} - ${rule.description}\n`;
        if (!rule.passed && rule.issue) {
          analysis += `   - **Issue**: ${rule.issue}\n`;
        }
      });
    }

    return analysis;
  }

  generateVelocityAnalysis(velocityData) {
    if (!velocityData) {
      return 'Velocity analysis data not available.';
    }

    let analysis = `**Velocity Score**: ${velocityData.score}/100\n\n`;
    
    if (velocityData.metrics) {
      analysis += `### Key Velocity Metrics\n\n`;
      analysis += `- **Commit Frequency**: ${velocityData.metrics.commitFrequency || 'N/A'} commits/day\n`;
      analysis += `- **Feature Completion**: ${velocityData.metrics.featureCompletion || 'N/A'}%\n`;
      analysis += `- **Build Success Rate**: ${velocityData.metrics.buildSuccess || 'N/A'}%\n`;
      analysis += `- **Deployment Frequency**: ${velocityData.metrics.deploymentFreq || 'N/A'}\n\n`;
    }

    return analysis;
  }

  generateSpecificationAnalysis(specData) {
    if (!specData) {
      return 'Specification alignment data not available.';
    }

    let analysis = `**Specification Alignment Score**: ${specData.score}/100\n\n`;
    
    if (specData.coverage) {
      analysis += `### Feature Coverage\n\n`;
      analysis += `- **Implemented Features**: ${specData.coverage.implemented}/${specData.coverage.total}\n`;
      analysis += `- **Coverage Percentage**: ${((specData.coverage.implemented / specData.coverage.total) * 100).toFixed(1)}%\n\n`;
    }

    if (specData.missingFeatures && specData.missingFeatures.length > 0) {
      analysis += `### Missing Features\n\n`;
      analysis += specData.missingFeatures.map(feature => `- ${feature}`).join('\n') + '\n\n';
    }

    return analysis;
  }

  generateCodeQualityAnalysis(qualityData) {
    if (!qualityData) {
      return 'Code quality analysis data not available.';
    }

    let analysis = `**Code Quality Score**: ${qualityData.score}/100\n\n`;
    
    if (qualityData.metrics) {
      analysis += `### Quality Metrics\n\n`;
      analysis += `- **TypeScript Compliance**: ${qualityData.metrics.typescript || 'N/A'}%\n`;
      analysis += `- **ESLint Compliance**: ${qualityData.metrics.eslint || 'N/A'}%\n`;
      analysis += `- **Build Health**: ${qualityData.metrics.build || 'N/A'}%\n`;
      analysis += `- **Import Consistency**: ${qualityData.metrics.imports || 'N/A'}%\n\n`;
    }

    return analysis;
  }

  generateArchitectureAnalysis(archData) {
    if (!archData) {
      return 'Architecture analysis data not available.';
    }

    let analysis = `**Architecture Integrity Score**: ${archData.score}/100\n\n`;
    
    if (archData.metrics) {
      analysis += `### Architecture Metrics\n\n`;
      analysis += `- **Directory Structure**: ${archData.metrics.structure || 'N/A'}%\n`;
      analysis += `- **File Naming**: ${archData.metrics.naming || 'N/A'}%\n`;
      analysis += `- **Component Organization**: ${archData.metrics.organization || 'N/A'}%\n`;
      analysis += `- **Service Patterns**: ${archData.metrics.patterns || 'N/A'}%\n\n`;
    }

    return analysis;
  }

  generateHistoricalAnalysis(history) {
    if (!history || history.length < 2) {
      return 'Insufficient historical data for trend analysis.';
    }

    let analysis = `### Health Trend Analysis\n\n`;
    
    // Calculate moving averages
    const recent = history.slice(-7); // Last 7 data points
    const recentAvg = recent.reduce((sum, h) => sum + h.overallScore, 0) / recent.length;
    
    const older = history.slice(-14, -7); // Previous 7 data points
    const olderAvg = older.length > 0 ? older.reduce((sum, h) => sum + h.overallScore, 0) / older.length : recentAvg;
    
    const trendDirection = recentAvg > olderAvg ? 'Improving' : recentAvg < olderAvg ? 'Declining' : 'Stable';
    const trendMagnitude = Math.abs(recentAvg - olderAvg);
    
    analysis += `- **Recent Trend**: ${trendDirection} (${trendMagnitude.toFixed(1)} point change)\n`;
    analysis += `- **Recent Average**: ${recentAvg.toFixed(1)}/100\n`;
    analysis += `- **Historical Average**: ${olderAvg.toFixed(1)}/100\n\n`;
    
    return analysis;
  }

  generateDetailedRecommendations(recommendations) {
    if (!recommendations || recommendations.length === 0) {
      return 'No specific recommendations at this time - maintain current practices.';
    }

    return recommendations.map((rec, index) => {
      const priority = rec.priority || 'medium';
      const priorityEmoji = priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢';
      
      let section = `### ${index + 1}. ${rec.title} ${priorityEmoji}\n\n`;
      section += `**Priority**: ${priority.toUpperCase()}\n`;
      
      if (rec.impact) {
        section += `**Impact**: ${rec.impact}\n`;
      }
      
      if (rec.effort) {
        section += `**Effort**: ${rec.effort}\n`;
      }
      
      section += `\n${rec.description}\n\n`;
      
      if (rec.steps && rec.steps.length > 0) {
        section += `**Implementation Steps**:\n`;
        section += rec.steps.map((step, i) => `${i + 1}. ${step}`).join('\n') + '\n\n';
      }
      
      return section;
    }).join('\n');
  }

  // Utility Methods

  formatDate(date) {
    return new Intl.DateTimeFormat(this.dateFormat, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: this.timezone
    }).format(date);
  }

  getHealthStatus(score) {
    if (score >= 90) return { label: 'EXCELLENT', color: 'green' };
    if (score >= 75) return { label: 'GOOD', color: 'blue' };
    if (score >= 60) return { label: 'NEEDS ATTENTION', color: 'yellow' };
    return { label: 'CRITICAL', color: 'red' };
  }

  getTrendDirection(trend) {
    if (!trend || typeof trend.change === 'undefined') return 'Stable';
    
    if (trend.change > 2) return 'Improving';
    if (trend.change < -2) return 'Declining';
    return 'Stable';
  }

  getTrendSymbol(trend) {
    if (!trend || typeof trend.change === 'undefined') return '→';
    
    if (trend.change > 0) return '↑';
    if (trend.change < 0) return '↓';
    return '→';
  }

  getStatusSymbol(score) {
    if (score >= 90) return '🟢';
    if (score >= 75) return '🔵';
    if (score >= 60) return '🟡';
    return '🔴';
  }

  capitalizeWords(str) {
    return str.replace(/([A-Z])/g, ' $1')
              .replace(/^./, char => char.toUpperCase())
              .trim();
  }

  generateMarkdownProgressBar(value, max = 100, width = 20) {
    const percentage = Math.min(100, (value / max) * 100);
    const filledWidth = Math.round((percentage / 100) * width);
    const emptyWidth = width - filledWidth;
    
    const filled = '█'.repeat(filledWidth);
    const empty = '░'.repeat(emptyWidth);
    
    return `\`${filled}${empty}\` ${percentage.toFixed(0)}%`;
  }

  calculateRiskLevel(healthData) {
    const score = healthData.overallScore;
    const criticalIssues = healthData.issues?.critical || 0;
    
    if (score < 60 || criticalIssues > 2) return 'HIGH';
    if (score < 75 || criticalIssues > 0) return 'MEDIUM';
    return 'LOW';
  }

  calculateNextCheck(healthData) {
    const score = healthData.overallScore;
    
    if (score < 60) return 'within 24 hours';
    if (score < 75) return 'within 3 days';
    if (score < 90) return 'within 1 week';
    return 'within 2 weeks';
  }

  // Additional helper methods for comprehensive reporting
  generateKeyFindings(healthData) {
    const findings = [];
    
    if (healthData.overallScore >= 90) {
      findings.push('✅ Project health is excellent with optimal performance across all dimensions');
    }
    
    if (healthData.issues?.critical > 0) {
      findings.push(`🚨 ${healthData.issues.critical} critical issues require immediate attention`);
    }
    
    if (healthData.trend?.change && Math.abs(healthData.trend.change) > 5) {
      const direction = healthData.trend.change > 0 ? 'improvement' : 'decline';
      findings.push(`📈 Significant health ${direction} detected (${healthData.trend.change.toFixed(1)}% change)`);
    }
    
    return findings.length > 0 ? findings.map(f => `- ${f}`).join('\n') : 
           '- No significant findings - project metrics are within expected ranges';
  }

  generatePerformanceMetrics(performanceData) {
    if (!performanceData) {
      return 'Performance metrics not available.';
    }

    return `### System Performance

- **Health Check Execution**: ${performanceData.healthCheckDuration || 'N/A'}ms
- **Data Collection**: ${performanceData.dataCollectionTime || 'N/A'}ms
- **Analysis Processing**: ${performanceData.analysisTime || 'N/A'}ms
- **Report Generation**: ${performanceData.reportGenerationTime || 'N/A'}ms

### Benchmarks
- **Target Health Check Time**: <10,000ms
- **Current Performance**: ${performanceData.overallPerformance || 'Unknown'}
- **Performance Grade**: ${performanceData.performanceGrade || 'N/A'}`;
  }

  generatePredictiveInsights(healthData) {
    if (!healthData.history || healthData.history.length < 5) {
      return 'Insufficient data for predictive analysis.';
    }

    return `### Predictive Analysis

Based on current trends and historical patterns:

- **7-day forecast**: Health score likely to be ${this.predictScore(healthData, 7)}/100
- **Risk assessment**: ${this.assessRisk(healthData)}
- **Recommended actions**: ${this.getRecommendedActions(healthData)}

*Predictions based on historical trend analysis and current trajectory*`;
  }

  generateNextSteps(healthData) {
    const steps = [];
    
    if (healthData.issues?.critical > 0) {
      steps.push('1. **Immediate**: Address critical issues identified in the analysis');
    }
    
    if (healthData.overallScore < 75) {
      steps.push('2. **Short-term**: Implement high-priority recommendations');
    }
    
    steps.push('3. **Ongoing**: Continue regular health monitoring');
    steps.push('4. **Review**: Schedule follow-up assessment based on recommended timeline');
    
    return steps.join('\n');
  }

  // Mock prediction methods (would be enhanced with actual ML in production)
  predictScore(healthData, days) {
    const recent = healthData.history.slice(-5);
    const avg = recent.reduce((sum, h) => sum + h.overallScore, 0) / recent.length;
    const trend = healthData.trend?.change || 0;
    
    // Simple linear prediction
    const predicted = avg + (trend * days / 7);
    return Math.max(0, Math.min(100, Math.round(predicted)));
  }

  assessRisk(healthData) {
    const score = healthData.overallScore;
    const trend = healthData.trend?.change || 0;
    
    if (score < 60 || trend < -10) return 'High risk of project health degradation';
    if (score < 75 || trend < -5) return 'Moderate risk - monitor closely';
    return 'Low risk - health trends are stable or improving';
  }

  getRecommendedActions(healthData) {
    if (healthData.overallScore >= 90) return 'Maintain current practices and monitor trends';
    if (healthData.overallScore >= 75) return 'Focus on addressing warning-level issues';
    return 'Implement immediate improvements for critical issues';
  }
}

module.exports = HealthReportTemplates;