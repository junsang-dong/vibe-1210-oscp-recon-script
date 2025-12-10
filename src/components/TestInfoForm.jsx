export default function TestInfoForm({ testInfo, setTestInfo }) {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        테스트 기본 정보
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            테스트 날짜
          </label>
          <input
            type="date"
            value={testInfo.testDate}
            onChange={(e) => setTestInfo({...testInfo, testDate: e.target.value})}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            테스터 이름
          </label>
          <input
            type="text"
            value={testInfo.tester}
            onChange={(e) => setTestInfo({...testInfo, tester: e.target.value})}
            placeholder="Hong Gildong"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            타겟 IP
          </label>
          <input
            type="text"
            value={testInfo.target}
            onChange={(e) => setTestInfo({...testInfo, target: e.target.value})}
            placeholder="192.168.10.75"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            호스트명
          </label>
          <input
            type="text"
            value={testInfo.targetHostname}
            onChange={(e) => setTestInfo({...testInfo, targetHostname: e.target.value})}
            placeholder="legacy-web.local"
            className="input-field"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            운영체제
          </label>
          <input
            type="text"
            value={testInfo.targetOS}
            onChange={(e) => setTestInfo({...testInfo, targetOS: e.target.value})}
            placeholder="Ubuntu 16.04 LTS"
            className="input-field"
          />
        </div>
      </div>
    </div>
  )
}

