# 🛡️ OSCP Report Generator

OSCP 스타일 침투 테스트 보고서를 자동으로 생성하는 웹 애플리케이션입니다.

## 🎯 주요 기능

- ✅ GPT-4로 자동 보고서 생성
- ✅ Executive Summary, Methodology, Finding Details 자동 작성
- ✅ OSCP 표준 형식 준수
- ✅ PDF 다운로드 기능
- ✅ 반응형 디자인
- ✅ 샘플 데이터 프리셋

## 🛠️ 기술 스택

- **Frontend**: React 18 + Vite + Tailwind CSS
- **API**: GPT-4 (gpt-4o-mini)
- **Deployment**: Vercel (Serverless Functions)
- **PDF Generation**: jsPDF + html2canvas
- **Icons**: Lucide React

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 OpenAI API 키를 설정하세요:

```
OPENAI_API_KEY=your_actual_api_key_here
```

### 3. 개발 서버 실행

**옵션 1: Vercel CLI 사용 (권장 - API 함수 포함)**

```bash
# Vercel CLI 설치 (전역)
npm i -g vercel

# 로컬 개발 서버 실행 (API 함수 포함)
vercel dev
```

**옵션 2: Vite만 사용 (프론트엔드만)**

```bash
npm run dev
```

> ⚠️ **참고**: Vite만 사용하는 경우 API 함수가 작동하지 않습니다. 로컬에서 API를 테스트하려면 `vercel dev`를 사용하세요.

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 🚀 배포 (Vercel)

### Vercel CLI 사용

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 연결
vercel

# 환경 변수 설정 (Vercel Dashboard에서)
# Settings → Environment Variables
# OPENAI_API_KEY = your_actual_api_key

# 프로덕션 배포
vercel --prod
```

### Vercel Dashboard 사용

1. vercel.com에서 로그인
2. "New Project" 클릭
3. GitHub 저장소 연결
4. Environment Variables에 `OPENAI_API_KEY` 추가
5. Deploy 클릭

## 📋 사용 방법

1. **샘플 데이터 로드**: "샘플 데이터 로드" 버튼을 클릭하여 Legacy Web Server 시나리오를 로드합니다.
2. **테스트 정보 입력**: 테스트 날짜, 테스터 이름, 타겟 정보를 입력합니다.
3. **취약점 추가**: "취약점 추가" 버튼으로 취약점을 추가하고 세부 정보를 입력합니다.
4. **보고서 생성**: "OSCP 보고서 자동 생성" 버튼을 클릭하여 GPT-4로 보고서를 생성합니다.
5. **미리보기**: 생성된 보고서를 미리 확인합니다.
6. **PDF 다운로드**: "PDF 다운로드" 버튼으로 보고서를 PDF로 저장합니다.

## 📁 프로젝트 구조

```
oscp-report-generator/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── TestInfoForm.jsx
│   │   ├── FindingsForm.jsx
│   │   ├── ReportPreview.jsx
│   │   └── PDFExport.jsx
│   ├── utils/
│   │   ├── reportTemplates.js
│   │   └── sampleData.js
│   ├── App.jsx
│   └── main.jsx
├── api/
│   └── generate-report.js (Vercel Function)
├── public/
├── index.html
├── tailwind.config.js
├── vite.config.js
├── vercel.json
└── package.json
```

## 🔒 보안 주의사항

- OpenAI API 키는 절대 클라이언트 코드에 포함하지 마세요.
- API 키는 Vercel의 Environment Variables에만 저장하세요.
- 프로덕션 환경에서는 CORS 설정을 적절히 조정하세요.

## 📝 라이선스

MIT License

## 🙏 기여

이슈 및 풀 리퀘스트를 환영합니다!

