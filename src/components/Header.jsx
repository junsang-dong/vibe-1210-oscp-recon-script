import { Shield, Github } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-600" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                OSCP Report Generator
              </h1>
              <p className="text-sm text-gray-600">
                침투 테스트 보고서 자동화 도구
              </p>
            </div>
          </div>
          
          <a
            href="https://github.com/junsang-dong/vibe-1210-oscp-recon-script"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Github size={24} />
          </a>
        </div>
      </div>
    </header>
  )
}

