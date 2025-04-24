# Commute Report 📋

출퇴근 시간을 자동으로 기록하고, 보고서를 생성할 수 있는 웹 애플리케이션입니다.  
이름, 출근 시간, 퇴근 시간을 입력하면 자동으로 포맷팅된 출퇴근 보고서를 만들어주고,  
클립보드 복사, 토스트 알림, 배경 이미지 설정 등 다양한 기능을 제공합니다.

---

## 🖥️ 데모 사이트

👉 [https://commute-report.vercel.app](https://commute-report.vercel.app)

---

## 📁 프로젝트 구조
commute-report/ 
├── index.html # 메인 페이지 
├── assets/ 
│ 
├── css/style.css # 스타일 시트 
│ 
└── js/main.js # 메인 스크립트

---

## ✅ 주요 기능

- **출/퇴근 시간 입력 및 자동 저장 (localStorage)**
- **시간대별 인사말 출력 (아침 / 오후 / 저녁 자동 갱신)**
- **실시간 시계 표시**
- **보고서 자동 생성 및 복사**
- **입력 누락 시 토스트 메시지 출력**
- **배경 이미지 업로드 및 밝기 분석**
- **모바일 반응형 UI**

---

## ⚙️ 사용 방법

### 1. 프로젝트 실행 (로컬)

```bash
git clone https://github.com/skythoth/commute-report.git
cd commute-report
open index.html
```

또는 VSCode의 Live Server 확장으로 실행 가능

### 2. 배포
본 프로젝트는 Vercel을 통해 배포됩니다.
자동 빌드 및 배포 설정 완료 후 커밋하면 실시간으로 반영됩니다.

---

## 🛠️ 기술 스택
HTML5 + CSS3 + JavaScript (Vanilla) : 기본 웹 개발
Bootstrap 5 (Toast UI)
LocalStorage API : 데이터 저장 및 관리
Canvas API (배경 밝기 분석) : 이미지 처리
Vercel (정적 사이트 배포) : 배포 및 호스팅

---

## 👨‍💻 개발자
GitHub: @skythoth
Email: skythoth@me.com

---

## 📄 라이선스
MIT License