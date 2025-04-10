# 📂 포트폴리오 프로젝트

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.x-3FCF8E?style=flat-square&logo=supabase)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.71-FF4154?style=flat-square&logo=react-query)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=flat-square&logo=tailwindcss)
![Zod](https://img.shields.io/badge/Zod-3.24-3068B7?style=flat-square)

> **현대적인 웹 개발 기술을 활용한 포트폴리오 프로젝트입니다. App Router 기반의 Next.js 15와 React 19를 중심으로, Tailwind CSS v4.1의 최신 UI 기능, Supabase 인증 시스템 및 타입 안전성을 최우선으로 설계되었습니다.**

## 🌟 주요 특징

- **Server Components & SSR**: Next.js 15의 App Router를 활용한 강력한 서버 사이드 렌더링
- **타입 안전성**: TypeScript와 Zod를 활용한 엄격한 타입 유효성 검증
- **반응형 디자인**: Tailwind CSS v4.1을 활용한 모든 디바이스에 최적화된 사용자 경험
- **데이터 관리**: React Query + Server Actions를 활용한 효율적인 상태 관리
- **인증 & 권한 제어**: Supabase Auth를 활용한 포괄적인 인증 시스템 구현
- **최신 React 패턴**: React 19 기능과 React Hooks를 활용한 컴포넌트 설계

## ⚙️ 기술 스택

### 프론트엔드

- **프레임워크**: Next.js 15 (App Router)
- **UI 라이브러리**: Radix UI 컴포넌트 + 커스텀 UI
- **스타일링**: Tailwind CSS v4.1 + SCSS
- **상태 관리**:
  - Zustand (클라이언트 상태)
  - TanStack Query v5 (서버 상태)
- **폼 & 유효성 검증**: React Hook Form + Zod

### 백엔드

- **데이터베이스 & 인증**: Supabase
- **서버 로직**: Next.js Server Actions
- **API 통신**: Server Components + TanStack Query
- **배포**: Vercel

### 개발 도구

- **언어**: TypeScript
- **코드 포맷팅**: ESLint + Prettier
- **패키지 관리**: pnpm

## 🚀 시작하기

```bash
# 저장소 복제
git clone <repository-url>
cd <repository-name>

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일에 다음 항목을 추가하세요:
# NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
# NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 패키지 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

## 📁 프로젝트 구조

```
/src
 ├── app/                    # Next.js App Router 구조
 │   ├── actions/            # Server Actions (인증, 프로젝트 CRUD)
 │   ├── auth/               # 인증 관련 페이지 (로그인, 회원가입, 콜백)
 │   ├── projects/           # 프로젝트 관련 페이지 (목록, 상세, 수정, 작성)
 │   ├── debug/              # 디버깅 페이지 (인증 상태 확인용)
 │   ├── layout.tsx          # 루트 레이아웃
 │   └── page.tsx            # 메인 페이지
 │
 ├── components/             # 재사용 가능한 UI 컴포넌트
 │   ├── auth/               # 인증 관련 컴포넌트 (로그인 폼, 회원가입 폼)
 │   ├── layout/             # 레이아웃 컴포넌트 (헤더, 푸터)
 │   └── ui/                 # 재사용 가능한 UI 컴포넌트 (버튼, 카드 등)
 │
 ├── contexts/               # React Context (인증 컨텍스트 등)
 │
 ├── features/               # 도메인별 기능 컴포넌트
 │   └── projects/           # 프로젝트 관련 컴포넌트 (목록, 상세, 폼)
 │
 ├── hooks/                  # 커스텀 React Hooks
 │   ├── useAuth.ts          # 인증 관련 훅
 │   └── useProjects.ts      # 프로젝트 관련 훅
 │
 ├── lib/                    # 외부 서비스 통합 및 클라이언트
 │   └── supabase/           # Supabase 클라이언트 설정 (서버, 클라이언트)
 │
 ├── providers/              # React Context Providers
 │
 ├── stores/                 # Zustand 상태 저장소
 │
 ├── styles/                 # 전역 스타일 및 변수
 │   ├── tailwind.css        # Tailwind CSS 임포트
 │   └── globals.scss        # 전역 SCSS 스타일
 │
 ├── types/                  # TypeScript 타입 정의
 │   └── project.ts          # 프로젝트 관련 타입
 │
 └── utils/                  # 순수 유틸리티 함수
```

## 📝 Tailwind CSS v4.1 설정

이 프로젝트는 최신 Tailwind CSS v4.1을 사용하며, 이전 버전과 완전히 다른 설정 방식을 적용합니다:

1. **패키지 설치**:
```bash
pnpm add tailwindcss @tailwindcss/postcss postcss
```

2. **PostCSS 설정** (postcss.config.mjs):
```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

3. **CSS 설정** (src/styles/tailwind.css):
```css
@import "tailwindcss";
```
> 주의: v4에서는 @tailwind 지시문 대신 @import를 사용합니다.

4. **레이아웃에서 스타일 임포트** (src/app/layout.tsx):
```javascript
import '@/styles/tailwind.css';
import '@/styles/globals.scss';
```

## 🔒 인증 시스템

Supabase Auth를 활용한 인증 시스템의 주요 기능:

### 사용자 인증

- 이메일/비밀번호 회원가입 및 로그인
- 인증 상태 전역 관리 (AuthContext)
- 로그인 상태 UI 표시 (헤더 컴포넌트)

### 권한 제어

- Server Actions에서 인증 검증
- 인증된 사용자만 프로젝트 생성, 수정, 삭제 가능
- 프로젝트 소유자(user_id)만 본인의 프로젝트 수정/삭제 가능
- UI 레벨에서 권한에 따른 버튼 노출 제어

### 구현 방식

- 클라이언트: AuthContext + useAuth 훅
- 서버: Server Actions + 미들웨어 패턴의 requireAuth 함수

## 🌐 성능 최적화

- **서버 컴포넌트**: 클라이언트로 전송되는 JavaScript 최소화
- **이미지 최적화**: Next.js Image 컴포넌트 활용
- **코드 분할**: 동적 임포트와 React.lazy 활용
- **데이터 프리페칭**: 사용자 경험 향상을 위한 데이터 사전 로딩
- **캐싱 전략**: TanStack Query 캐싱으로 불필요한 네트워크 요청 방지
- **Vercel 배포**: Edge Network를 활용한 글로벌 CDN 배포

## 💻 개발 팁

### 인증 기능 활용

- 로컬 개발 시 `/auth/signup`으로 계정 생성
- 개발 모드에서 인증 디버깅은 `/debug` 페이지 활용
- Supabase 대시보드에서 사용자 계정 관리 가능

### Tailwind CSS v4 사용 팁

- 스타일 적용 시 직접 클래스 사용: `className="text-3xl font-bold"`
- v4에서 변경된 새로운 문법과 기능 활용
- 브라우저 요소 검사 도구로 적용된 스타일 확인

## 🤝 기여하기

기여는 항상 환영합니다!

1. 이 저장소를 포크하고 로컬 시스템에 복제합니다.
2. 새 브랜치를 만듭니다: `git checkout -b feature/amazing-feature`
3. 변경 사항을 커밋합니다: `git commit -m 'Add amazing feature'`
4. 브랜치를 푸시합니다: `git push origin feature/amazing-feature`
5. Pull Request를 제출합니다.

## 📝 라이선스

[MIT](./LICENSE)

---

**🔗 배포 링크**: [포트폴리오 프로젝트 (Vercel)](https://my-project-vercel-url.vercel.app)

_이 프로젝트는 지속적으로 개선되고 있습니다. 제안이나 피드백이 있으시면 이슈를 생성해 주세요!_
