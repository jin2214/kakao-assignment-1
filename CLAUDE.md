# 2차 과제 — Vanilla JS Todo → React 마이그레이션

## 프로젝트 개요

- **브랜치:** `week-03-박찬진`
- **목표:** 1차 과제(`app.js`)의 Vanilla JS Todo 앱을 React Function Component 구조로 마이그레이션
- **구현 계획 상세:** `docs/plan.md` 참고

## 기술 스택

- React 18+, Vite 5.x, Tailwind CSS 4.x, JavaScript
- Web Storage API (localStorage)

## 디렉토리 구조

```
kakaotech.assignment_1/
├── CLAUDE.md              # 이 파일
├── docs/plan.md           # 상세 구현 계획
├── app.js                 # 1차 과제 원본 (참고용)
├── index.html             # 1차 과제 원본 (참고용)
├── style.css              # 1차 과제 원본 (참고용)
└── assignment-2/            # 2차 과제 React 프로젝트 (Vite)
    ├── src/
    │   ├── App.jsx
    │   ├── utils/dateUtils.js
    │   └── components/
    │       ├── WeekView.jsx
    │       ├── DateNav.jsx
    │       ├── FilterTabs.jsx
    │       ├── TodoInput.jsx
    │       ├── TodoList.jsx
    │       ├── TodoItem.jsx
    │       └── Stats.jsx
    └── ...
```

## 작업 규칙

- 구현은 `docs/plan.md`의 Step 순서대로 진행
- 각 Step 완료 후 체크리스트와 코드 개념 설명 제공
- 사용자가 직접 코드를 작성하고 싶은 경우 방법을 안내하는 방식으로 진행
- 기능 단위로 하나씩 확인 후 다음 단계로 이동
