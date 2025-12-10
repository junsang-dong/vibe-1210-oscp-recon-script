import { Shield, AlertTriangle, Info } from 'lucide-react'

export default function ReportPreview({ report }) {
  const { testInfo, executiveSummary, methodology, findings } = report

  const getSeverityIcon = (severity) => {
    const icons = {
      'Critical': <AlertTriangle className="text-red-600" size={20} />,
      'High': <AlertTriangle className="text-orange-600" size={20} />,
      'Medium': <Info className="text-yellow-600" size={20} />,
      'Low': <Info className="text-blue-600" size={20} />
    }
    return icons[severity] || <Info size={20} />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card space-y-8" id="report-content">
        {/* 표지 */}
        <div className="text-center py-12 border-b-2 border-gray-200">
          <Shield className="mx-auto mb-4 text-blue-600" size={64} />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            침투 테스트 보고서
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {testInfo.targetHostname}
          </p>
          <p className="text-gray-500">
            {testInfo.testDate}
          </p>
          <div className="mt-8 text-sm text-gray-600">
            <p>작성자: {testInfo.tester}</p>
            <p>타겟: {testInfo.target}</p>
          </div>
        </div>

        {/* Executive Summary */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-blue-600">📋</span>
            Executive Summary
          </h2>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {executiveSummary}
            </div>
          </div>
        </section>

        {/* 취약점 통계 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            취약점 요약
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Critical', 'High', 'Medium', 'Low'].map(severity => {
              const count = findings.filter(f => f.severity === severity).length
              const colors = {
                'Critical': 'bg-red-100 text-red-800 border-red-300',
                'High': 'bg-orange-100 text-orange-800 border-orange-300',
                'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
                'Low': 'bg-blue-100 text-blue-800 border-blue-300'
              }
              return (
                <div key={severity} className={`p-4 rounded-lg border-2 ${colors[severity]}`}>
                  <div className="text-3xl font-bold">{count}</div>
                  <div className="text-sm font-medium">{severity}</div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Methodology */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-blue-600">🔍</span>
            Methodology
          </h2>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {methodology}
            </div>
          </div>
        </section>

        {/* Detailed Findings */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-blue-600">🎯</span>
            Detailed Findings
          </h2>
          
          <div className="space-y-8">
            {findings.map((finding, index) => (
              <div key={finding.id} className="border-2 border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getSeverityIcon(finding.severity)}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Finding #{index + 1}: {finding.title}
                      </h3>
                      <p className="text-sm text-gray-600">{finding.category}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    finding.severity === 'Critical' ? 'severity-critical' :
                    finding.severity === 'High' ? 'severity-high' :
                    finding.severity === 'Medium' ? 'severity-medium' :
                    'severity-low'
                  }`}>
                    {finding.severity}
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    CVSS Score: <span className="font-bold text-blue-600">{finding.cvss}</span>
                  </span>
                </div>

                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {finding.generatedContent}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 결론 */}
        <section className="border-t-2 border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Conclusion
          </h2>
          <p className="text-gray-700 leading-relaxed">
            이 침투 테스트는 {testInfo.target}에 대해 수행되었으며, 
            총 {findings.length}개의 취약점이 발견되었습니다. 
            발견된 취약점들은 적절한 보안 조치를 통해 해결되어야 하며, 
            특히 Critical 및 High 심각도의 취약점은 즉시 패치되어야 합니다.
          </p>
        </section>
      </div>
    </div>
  )
}

