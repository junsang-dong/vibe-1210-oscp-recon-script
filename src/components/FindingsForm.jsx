import { Trash2 } from 'lucide-react'

export default function FindingsForm({ finding, index, updateFinding, removeFinding }) {
  const severityOptions = ['Critical', 'High', 'Medium', 'Low', 'Informational']
  
  const severityColors = {
    'Critical': 'severity-critical',
    'High': 'severity-high',
    'Medium': 'severity-medium',
    'Low': 'severity-low',
    'Informational': 'bg-gray-100 text-gray-800 border border-gray-300'
  }

  return (
    <div className="card border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          취약점 #{index + 1}
        </h3>
        <button
          onClick={() => removeFinding(finding.id)}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            취약점 제목
          </label>
          <input
            type="text"
            value={finding.title}
            onChange={(e) => updateFinding(finding.id, 'title', e.target.value)}
            placeholder="예: Unrestricted File Upload"
            className="input-field"
          />
        </div>

        {/* 심각도 & CVSS */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              심각도
            </label>
            <select
              value={finding.severity}
              onChange={(e) => updateFinding(finding.id, 'severity', e.target.value)}
              className={`input-field ${severityColors[finding.severity]} font-semibold`}
            >
              {severityOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVSS 점수
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={finding.cvss}
              onChange={(e) => updateFinding(finding.id, 'cvss', parseFloat(e.target.value))}
              className="input-field"
            />
          </div>
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            취약점 카테고리
          </label>
          <input
            type="text"
            value={finding.category}
            onChange={(e) => updateFinding(finding.id, 'category', e.target.value)}
            placeholder="예: Remote Code Execution, SQL Injection"
            className="input-field"
          />
        </div>

        {/* 설명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            취약점 설명
          </label>
          <textarea
            value={finding.description}
            onChange={(e) => updateFinding(finding.id, 'description', e.target.value)}
            placeholder="취약점에 대한 간단한 설명을 입력하세요..."
            rows="3"
            className="input-field"
          />
        </div>

        {/* 영향 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            비즈니스 영향
          </label>
          <textarea
            value={finding.impact}
            onChange={(e) => updateFinding(finding.id, 'impact', e.target.value)}
            placeholder="이 취약점이 조직에 미치는 영향을 설명하세요..."
            rows="2"
            className="input-field"
          />
        </div>

        {/* 재현 단계 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            재현 단계 (한 줄에 하나씩)
          </label>
          <textarea
            value={finding.steps}
            onChange={(e) => updateFinding(finding.id, 'steps', e.target.value)}
            placeholder="1. Browse to http://target/upload.php&#10;2. Upload malicious file&#10;3. Execute uploaded file"
            rows="4"
            className="input-field font-mono text-sm"
          />
        </div>

        {/* 해결 방안 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            해결 방안
          </label>
          <textarea
            value={finding.remediation}
            onChange={(e) => updateFinding(finding.id, 'remediation', e.target.value)}
            placeholder="이 취약점을 해결하기 위한 구체적인 방법을 제시하세요..."
            rows="3"
            className="input-field"
          />
        </div>
      </div>
    </div>
  )
}

