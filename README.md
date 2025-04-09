# 📂 포트폴리오 프로젝트

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.x-3FCF8E?style=flat-square&logo=supabase)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.71-FF4154?style=flat-square&logo=react-query)
![Zod](https://img.shields.io/badge/Zod-3.24-3068B7?style=flat-square)

> **현대적인 웹 개발 기술을 활용한 포트폴리오 프로젝트입니다. App Router 기반의 Next.js 15와 React 19를 중심으로, 타입 안전성과 사용자 경험을 최우선으로 설계되었습니다.**

## 🌟 주요 특징

- **Server Components & SSR**: Next.js 15의 App Router를 활용한 강력한 서버 사이드 렌더링
- **타입 안전성**: TypeScript와 Zod를 활용한 엄격한 타입 유효성 검증
- **반응형 디자인**: 모든 디바이스에 최적화된 사용자 경험 제공
- **데이터 관리**: React Query + Server Actions를 활용한 효율적인 상태 관리
- **데이터베이스 & 인증**: Supabase를 활용한 백엔드 기능 구현
- **최신 React 패턴**: React 19 기능과 React Hooks를 활용한 컴포넌트 설계

## ⚙️ 기술 스택

### 프론트엔드

- **프레임워크**: Next.js 15 (App Router)
- **UI 라이브러리**: Radix UI 컴포넌트 + 커스텀 UI
- **스타일링**: SCSS + CSS Modules
- **상태 관리**:
  - Zustand (클라이언트 상태)
  - TanStack Query v5 (서버 상태)
- **폼 & 유효성 검증**: React Hook Form + Zod

### 백엔드

- **데이터베이스 & 인증**: Supabase
- **서버 로직**: Next.js Server Actions

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
# .env.local 파일을 열고 Supabase 연결 정보 입력

# 패키지 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

## 📁 프로젝트 구조

```
/src
 ├── app/             # Next.js App Router 구조
 │   ├── actions/     # Server Actions
 │   ├── projects/    # 프로젝트 관련 페이지
 │   └── page.tsx     # 메인 페이지
 │
 ├── components/      # 재사용 가능한 UI 컴포넌트
 ├── features/        # 도메인별 기능 컴포넌트
 ├── hooks/           # 커스텀 React Hooks
 ├── lib/             # 외부 서비스 통합 및 클라이언트
 │   ├── api/         # API 클라이언트 및 통신 로직
 │   └── supabase/    # Supabase 클라이언트 설정
 │
 ├── providers/       # React Context Providers
 ├── stores/          # Zustand 상태 저장소
 ├── styles/          # 전역 스타일 및 변수
 ├── types/           # TypeScript 타입 정의
 └── utils/           # 순수 유틸리티 함수 (포맷터, 헬퍼 등)
```

### 📂 디렉토리 역할 구분

중복과 혼동을 방지하기 위해 유사한 디렉토리의 역할을 명확히 구분합니다:

- **lib/**: 외부 서비스와의 통합 로직을 담당합니다.

  - 예: Supabase, Firebase, Axios 등 외부 서비스 클라이언트
  - API 통신 로직 및 서비스 래퍼
  - `@/lib/api`, `@/lib/supabase` 등으로 임포트

- **utils/**: 순수 유틸리티 함수를 포함합니다.
  - 문자열 포맷팅, 날짜 변환 등의 헬퍼 함수
  - 비즈니스 로직과 무관한 순수 함수
  - 범용적으로 재사용 가능한 유틸리티
  - `@/utils/date`, `@/utils/format` 등으로 임포트

> **주의**: `@/lib/utils`와 같은 중첩 경로는 사용하지 않습니다. 유틸리티 함수는 항상 루트 레벨의 `@/utils` 경로에만 위치시킵니다.

### 📂 경로 별칭 (Path Aliases)

tsconfig.json에 경로 별칭이 구성되어 있어 가독성 높은 임포트가 가능합니다:

```typescript
// 기존 상대 경로 방식
import Button from '../../../components/ui/Button';

// 별칭을 사용한 방식
import Button from '@/components/ui/Button';
```

주요 별칭:

- `@/components/*` - 공통 UI 컴포넌트
- `@/features/*` - 도메인별 비즈니스 로직
- `@/hooks/*` - 커스텀 훅
- `@/lib/*` - 유틸리티 및 서비스
- `@/styles/*` - 스타일 관련 파일
- `@/types/*` - 타입 정의

## 🌐 성능 최적화

- **이미지 최적화**: Next.js Image 컴포넌트 활용
- **코드 분할**: 동적 임포트와 React.lazy 활용
- **서버 컴포넌트**: 클라이언트로 전송되는 JavaScript 최소화
- **데이터 프리페칭**: 사용자 경험 향상을 위한 데이터 사전 로딩
- **캐싱 전략**: TanStack Query 캐싱으로 불필요한 네트워크 요청 방지

## 🧪 개발 경험 개선

- **타입 안전성**: TypeScript + Zod로 런타임 오류 최소화
- **API 추상화**: 일관된 API 클라이언트로 데이터 액세스 단순화
- **자동 완성**: VSCode와의 통합으로 개발 생산성 향상
- **경로 별칭**: `@/components`, `@/features` 등의 별칭으로 가독성 있는 임포트 제공
- **유지보수성**: 모듈화된 코드 구조와 명확한 책임 분리

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

**🔗 배포 링크**: 배포 예정

_이 프로젝트는 지속적으로 개선되고 있습니다. 제안이나 피드백이 있으시면 이슈를 생성해 주세요!_
