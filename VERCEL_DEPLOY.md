# 🚀 Vercel 배포 가이드

## 📋 배포 전 확인 사항

### ✅ Vercel Functions에서 API 키 처리 방식

현재 구현된 방식:
- **클라이언트에서 입력한 API 키**를 Vercel Function으로 전달
- Vercel Function은 클라이언트에서 받은 API 키를 우선 사용
- 환경 변수 `OPENAI_API_KEY`가 설정되어 있으면 폴백으로 사용

**코드 위치**: `api/generate-report.js`
```javascript
const { section, data, apiKey } = req.body;
const openaiApiKey = apiKey || process.env.OPENAI_API_KEY;
```

이 방식의 장점:
- ✅ 사용자가 직접 API 키를 입력하여 사용 가능
- ✅ 환경 변수로 기본 API 키 설정 가능 (선택사항)
- ✅ 유연한 API 키 관리

---

## 🎯 배포 방법

### 방법 1: Vercel Dashboard 사용 (권장)

#### 1단계: GitHub 리포지토리 연결
1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. "Add New..." → "Project" 클릭
3. "Import Git Repository"에서 `junsang-dong/vibe-1210-oscp-recon-script` 선택
4. "Import" 클릭

#### 2단계: 프로젝트 설정
- **Framework Preset**: Vite (자동 감지됨)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (자동 설정됨)
- **Output Directory**: `dist` (자동 설정됨)

#### 3단계: 환경 변수 설정 (선택사항)
**Settings** → **Environment Variables**에서 추가:

```
OPENAI_API_KEY = your_openai_api_key_here
```

> ⚠️ **참고**: 환경 변수는 선택사항입니다. 사용자가 웹앱에서 직접 API 키를 입력할 수 있으므로 필수는 아닙니다.

#### 4단계: 배포
- "Deploy" 버튼 클릭
- 배포 완료 후 제공되는 URL로 접속

---

### 방법 2: Vercel CLI 사용

#### 1단계: Vercel CLI 설치
```bash
npm i -g vercel
```

#### 2단계: Vercel 로그인
```bash
vercel login
```

#### 3단계: 프로젝트 배포
```bash
cd /Users/jmac/Desktop/vibe-1210-oscp-recon-script
vercel
```

첫 배포 시 질문에 답변:
- **Set up and deploy?** → Yes
- **Which scope?** → 본인 계정 선택
- **Link to existing project?** → No
- **Project name?** → `vibe-1210-oscp-recon-script` (또는 원하는 이름)
- **Directory?** → `./` (기본값)
- **Override settings?** → No

#### 4단계: 환경 변수 설정 (선택사항)
```bash
vercel env add OPENAI_API_KEY
# 프롬프트에서 API 키 입력
```

#### 5단계: 프로덕션 배포
```bash
vercel --prod
```

---

## 🔧 배포 후 확인 사항

### 1. Vercel Functions 확인
- 배포 후 Vercel Dashboard에서 **Functions** 탭 확인
- `api/generate-report.js`가 Serverless Function으로 배포되었는지 확인

### 2. API 엔드포인트 테스트
배포된 URL에서:
```
https://your-project.vercel.app/api/generate-report
```

### 3. CORS 설정 확인
현재 설정:
- `Access-Control-Allow-Origin: *` (모든 도메인 허용)
- 프로덕션에서는 특정 도메인만 허용하도록 제한 권장

---

## 📝 환경 변수 vs 클라이언트 입력

### 옵션 1: 환경 변수 사용 (서버에서 관리)
**장점:**
- API 키가 클라이언트에 노출되지 않음
- 모든 사용자가 동일한 API 키 사용

**단점:**
- Vercel Dashboard에서 관리 필요
- 사용자별 API 키 사용 불가

**설정 방법:**
```bash
# Vercel Dashboard에서
OPENAI_API_KEY = sk-...
```

### 옵션 2: 클라이언트 입력 (현재 구현)
**장점:**
- 사용자가 자신의 API 키 사용 가능
- 유연한 API 키 관리
- 환경 변수 설정 불필요

**단점:**
- API 키가 네트워크를 통해 전달됨 (HTTPS로 암호화됨)
- 각 요청마다 API 키 전송

**현재 구현:**
- 클라이언트에서 입력한 API 키를 Vercel Function으로 전달
- 환경 변수가 있으면 폴백으로 사용

---

## 🔒 보안 권장사항

1. **HTTPS 사용**: Vercel은 기본적으로 HTTPS 제공
2. **API 키 검증**: Vercel Function에서 API 키 형식 검증 추가 가능
3. **Rate Limiting**: Vercel Pro 플랜에서 Rate Limiting 설정 가능
4. **CORS 제한**: 프로덕션에서는 특정 도메인만 허용

---

## 🐛 문제 해결

### 문제: API Function이 작동하지 않음
**해결:**
- Vercel Dashboard → Functions 탭에서 로그 확인
- `api/generate-report.js` 파일이 올바른 위치에 있는지 확인

### 문제: CORS 오류
**해결:**
- `api/generate-report.js`의 CORS 헤더 확인
- 브라우저 콘솔에서 오류 메시지 확인

### 문제: 빌드 실패
**해결:**
- Vercel Dashboard → Deployments에서 빌드 로그 확인
- 로컬에서 `npm run build` 실행하여 오류 확인

---

## 📚 추가 리소스

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [OpenAI API Documentation](https://platform.openai.com/docs)

---

## ✅ 배포 체크리스트

- [ ] GitHub 리포지토리에 코드 푸시 완료
- [ ] Vercel 프로젝트 생성 및 연결
- [ ] 환경 변수 설정 (선택사항)
- [ ] 배포 성공 확인
- [ ] API Function 동작 테스트
- [ ] 웹앱 UI 동작 확인
- [ ] PDF 다운로드 기능 테스트

---

**배포 완료 후 URL**: `https://your-project.vercel.app`

