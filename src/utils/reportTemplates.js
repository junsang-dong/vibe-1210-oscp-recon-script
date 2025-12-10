// 보고서 템플릿 유틸리티 함수들
// 필요시 확장 가능

export const reportSections = {
  executiveSummary: 'Executive Summary',
  methodology: 'Methodology',
  findings: 'Detailed Findings',
  conclusion: 'Conclusion'
}

export const severityLevels = {
  Critical: {
    color: 'red',
    cvssRange: [9.0, 10.0],
    priority: 1
  },
  High: {
    color: 'orange',
    cvssRange: [7.0, 8.9],
    priority: 2
  },
  Medium: {
    color: 'yellow',
    cvssRange: [4.0, 6.9],
    priority: 3
  },
  Low: {
    color: 'blue',
    cvssRange: [0.1, 3.9],
    priority: 4
  },
  Informational: {
    color: 'gray',
    cvssRange: [0.0, 0.0],
    priority: 5
  }
}

export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function getSeverityColor(severity) {
  return severityLevels[severity]?.color || 'gray'
}

