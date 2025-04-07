# 🚀 프로젝트 이름 (Project Name)

모던 웹 기술 스택을 기반으로 한 고성능 웹 애플리케이션입니다. Next.js 15를 중심으로 구축되었으며, 뛰어난 사용자 경험(UX)과 접근성, SEO 최적화를 동시에 고려한 구조로 설계되었습니다.

## 🛠 기술 스택

- **Framework**: [Next.js 15](https://nextjs.org/docs) (App Router)
- **Language**: TypeScript
- **UI**: Radix UI, SCSS, CSS Modules
- **Database & Auth**: Supabase
- **스타일 기준**
  - rem 단위 사용 (root font-size: 10px)
  - 최신 디자인 트렌드 반영 (세련된 UI & 섬세한 인터랙션)
- **기타**
  - 컴포넌트 기반 아키텍처
  - 비즈니스 로직은 별도 파일로 분리
  - 유지보수와 확장성 고려한 폴더 구조

## 📦 설치 및 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 프로덕션 빌드
npm run build
```

## 🌳 폴더 구조 예시

```bash
/src
  ├── components      # UI 컴포넌트
  ├── features        # 도메인 단위 비즈니스 로직
  ├── app             # App Router 기반 페이지
  ├── styles          # SCSS 및 전역 스타일
  ├── lib             # 유틸, API 통신, Supabase 등
  └── types           # 전역 타입 정의
```

## 🌐 배포

배포 주소: [https://your-deployment-url.com](https://your-deployment-url.com) <!-- 수정 필요 -->

## 📎 접근성 및 SEO

- 웹 접근성 표준을 준수하여 모든 사용자가 문제없이 이용 가능
- 검색 엔진 최적화를 고려한 Head 메타 구성 및 동적 페이지 처리

## 🤝 기여

1. 이슈를 먼저 등록해주세요.
2. PR 생성 전 `npm run lint` 및 `npm run build`로 체크해주세요.

## 📝 라이선스

[MIT](./LICENSE)
