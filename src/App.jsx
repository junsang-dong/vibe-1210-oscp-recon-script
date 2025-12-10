import { useState } from 'react'
import { Shield, FileText, Download, Plus, Trash2 } from 'lucide-react'
import Header from './components/Header'
import TestInfoForm from './components/TestInfoForm'
import FindingsForm from './components/FindingsForm'
import ReportPreview from './components/ReportPreview'
import PDFExport from './components/PDFExport'
import { getSampleData, getAllSampleScenarios } from './utils/sampleData'

function App() {
  const [testInfo, setTestInfo] = useState({
    testDate: new Date().toISOString().split('T')[0],
    tester: '',
    target: '',
    targetHostname: '',
    targetOS: ''
  })

  const [findings, setFindings] = useState([])
  const [currentView, setCurrentView] = useState('input') // input, preview, pdf
  const [generatedReport, setGeneratedReport] = useState(null)
  const [loading, setLoading] = useState(false)

  // 샘플 데이터 로드
  const loadSampleData = (scenarioNumber = 1) => {
    const sample = getSampleData(scenarioNumber)
    setTestInfo(sample.testInfo)
    setFindings(sample.findings)
  }

  // Finding 추가
  const addFinding = () => {
    const newFinding = {
      id: Date.now(),
      title: '',
      severity: 'Medium',
      category: '',
      description: '',
      impact: '',
      steps: '',
      remediation: '',
      cvss: 5.0
    }
    setFindings([...findings, newFinding])
  }

  // Finding 삭제
  const removeFinding = (id) => {
    setFindings(findings.filter(f => f.id !== id))
  }

  // Finding 업데이트
  const updateFinding = (id, field, value) => {
    setFindings(findings.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ))
  }

  // 보고서 생성
  const generateReport = async () => {
    setLoading(true)
    try {
      // API 엔드포인트 (Vercel Function 사용)
      const apiEndpoint = '/api/generate-report'

      // Executive Summary 생성
      const summaryResponse = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'executive_summary',
          data: {
            testDate: testInfo.testDate,
            tester: testInfo.tester,
            target: testInfo.target,
            findingsCount: findings.length,
            criticalCount: findings.filter(f => f.severity === 'Critical').length
          }
        })
      })

      if (!summaryResponse.ok) {
        const errorText = await summaryResponse.text()
        let errorMessage = `HTTP ${summaryResponse.status}: ${summaryResponse.statusText}`
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.error || errorMessage
        } catch (e) {
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const summaryData = await summaryResponse.json()
      if (summaryData.error) throw new Error(summaryData.error)
      if (!summaryData.content) throw new Error('No content in response')
      const executiveSummary = summaryData.content

      // Methodology 생성
      const methodologyResponse = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'methodology',
          data: {
            target: testInfo.target,
            scope: `${testInfo.targetHostname} (${testInfo.targetOS})`
          }
        })
      })

      if (!methodologyResponse.ok) {
        const errorText = await methodologyResponse.text()
        let errorMessage = `HTTP ${methodologyResponse.status}: ${methodologyResponse.statusText}`
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.error || errorMessage
        } catch (e) {
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const methodologyData = await methodologyResponse.json()
      if (methodologyData.error) throw new Error(methodologyData.error)
      if (!methodologyData.content) throw new Error('No content in response')
      const methodology = methodologyData.content

      // 각 Finding에 대한 상세 분석 생성
      const detailedFindings = await Promise.all(
        findings.map(async (finding) => {
          const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              section: 'finding_detail',
              data: {
                title: finding.title,
                severity: finding.severity,
                description: finding.description
              }
            })
          })

          if (!response.ok) {
            const errorText = await response.text()
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`
            try {
              const errorJson = JSON.parse(errorText)
              errorMessage = errorJson.error || errorMessage
            } catch (e) {
              errorMessage = errorText || errorMessage
            }
            throw new Error(errorMessage)
          }

          const data = await response.json()
          if (data.error) throw new Error(data.error)
          if (!data.content) throw new Error('No content in response')
          return {
            ...finding,
            generatedContent: data.content
          }
        })
      )

      setGeneratedReport({
        testInfo,
        executiveSummary,
        methodology,
        findings: detailedFindings
      })
      setCurrentView('preview')
    } catch (error) {
      console.error('보고서 생성 오류:', error)
      alert(`보고서 생성 중 오류가 발생했습니다: ${error.message}\n\nVercel 환경 변수에 OPENAI_API_KEY가 설정되어 있는지 확인해주세요.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* 네비게이션 탭 */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setCurrentView('input')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              currentView === 'input'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FileText size={20} />
            입력
          </button>
          <button
            onClick={() => setCurrentView('preview')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              currentView === 'preview'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            disabled={!generatedReport}
          >
            <Shield size={20} />
            미리보기
          </button>
        </div>

        {/* 입력 뷰 */}
        {currentView === 'input' && (
          <div className="space-y-6">
            {/* 샘플 데이터 선택 */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                📋 침투 테스트 샘플 데이터 선택
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getAllSampleScenarios().map((scenario) => (
                  <button
                    key={scenario.number}
                    onClick={() => loadSampleData(scenario.number)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="font-semibold text-gray-800 mb-1">
                      시나리오 #{scenario.number}: {scenario.name}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      타겟: {scenario.target}
                    </div>
                    <div className="text-xs">
                      <span className={`px-2 py-1 rounded ${
                        scenario.difficulty === 'Hard' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        난이도: {scenario.difficulty}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 테스트 정보 입력 */}
            <TestInfoForm 
              testInfo={testInfo} 
              setTestInfo={setTestInfo} 
            />

            {/* Findings 입력 */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  취약점 목록
                </h2>
                <button
                  onClick={addFinding}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={20} />
                  취약점 추가
                </button>
              </div>

              {findings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Shield size={48} className="mx-auto mb-4 opacity-50" />
                  <p>아직 추가된 취약점이 없습니다.</p>
                  <p className="text-sm mt-2">위 버튼을 눌러 취약점을 추가하거나 샘플 데이터를 로드하세요.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {findings.map((finding, index) => (
                    <FindingsForm
                      key={finding.id}
                      finding={finding}
                      index={index}
                      updateFinding={updateFinding}
                      removeFinding={removeFinding}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 보고서 생성 버튼 */}
            <div className="card">
              <button
                onClick={generateReport}
                disabled={loading || findings.length === 0}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    보고서 생성 중...
                  </>
                ) : (
                  <>
                    <Shield size={24} />
                    OSCP 보고서 자동 생성
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* 미리보기 뷰 */}
        {currentView === 'preview' && generatedReport && (
          <div className="space-y-6">
            <ReportPreview report={generatedReport} />
            <PDFExport report={generatedReport} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="mb-2">🛡️ OSCP Pentest Report Generator</p>
          <p className="text-sm">바이브코딩 보안 워크북 P3 프로젝트 | GPT-4 Powered</p>
        </div>
      </footer>
    </div>
  )
}

export default App

