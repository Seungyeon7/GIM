# 배포 가이드 (Deployment Guide)

이 문서는 완성된 리액트 애플리케이션을 인터넷에 배포하여 다른 사람들도 접속할 수 있게 하는 방법을 설명합니다. 가장 대중적이고 무료인 **GitHub Pages**와 **Vercel** 두 가지 방법을 안내합니다.

## 사전 준비 (Prerequisites)

1.  **Git 설치**: 컴퓨터에 Git이 설치되어 있어야 합니다.
2.  **GitHub 계정**: [GitHub](https://github.com/) 계정이 필요합니다.
3.  **VS Code 터미널**: VS Code에서 `Ctrl + \``를 눌러 터미널을 엽니다.

---

## 방법 1: GitHub Pages로 배포하기 (추천)

GitHub 저장소(Repository)를 만들고 그곳에 코드를 올린 뒤, 무료 호스팅 기능을 켜는 방법입니다.

### 1. Git 초기화 및 커밋
터미널에 다음 명령어들을 순서대로 입력하세요.

```bash
# 1. Git 초기화
git init

# 2. 모든 파일 스테이징
git add .

# 3. 첫 커밋
git commit -m "Initial commit"
```

### 2. GitHub 저장소 생성 및 연결
1.  [GitHub New Repository](https://github.com/new) 페이지로 이동합니다.
2.  **Repository name**에 `gyeonggi-interview-practice` (또는 원하는 이름)을 입력합니다.
3.  **Public**을 선택하고 **Create repository** 버튼을 누릅니다.
4.  생성된 페이지에서 `…or push an existing repository from the command line` 섹션의 코드를 복사하여 터미널에 붙여넣고 실행합니다. (아래는 예시입니다. 본인의 주소를 사용하세요)

```bash
git remote add origin https://github.com/YOUR_USERNAME/gyeonggi-interview-practice.git
git branch -M main
git push -u origin main
```

### 3. `gh-pages` 패키지 설치
배포를 쉽게 도와주는 도구를 설치합니다.

```bash
npm install gh-pages --save-dev
```

### 4. `package.json` 설정
`package.json` 파일을 열고 다음 내용을 수정/추가합니다.

1.  **`homepage` 추가**: 파일의 최상단(첫 번째 중괄호 `{` 바로 아래)에 다음 줄을 추가합니다.
    ```json
    "homepage": "https://YOUR_USERNAME.github.io/REPOSITORY_NAME",
    ```
    *   `YOUR_USERNAME`: 본인의 GitHub 아이디
    *   `REPOSITORY_NAME`: 저장소 이름 (예: `gyeonggi-interview-practice`)

2.  **`scripts` 추가**: `scripts` 부분에 `predeploy`와 `deploy`를 추가합니다.
    ```json
    "scripts": {
      // ... 기존 스크립트들 ...
      "predeploy": "npm run build",
      "deploy": "gh-pages -d dist"
    },
    ```

### 5. `vite.config.ts` 설정
`vite.config.ts` 파일을 열고 `base` 설정을 추가합니다.

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/REPOSITORY_NAME/', // 예: '/gyeonggi-interview-practice/' (앞뒤 슬래시 필수)
})
```

### 6. 배포 실행
터미널에 다음 명령어를 입력합니다.

```bash
npm run deploy
```

완료되면 `Published`라는 메시지가 뜹니다. 잠시 후(1~5분) 설정한 `homepage` 주소로 접속하면 앱이 보입니다.

---

## 방법 2: Vercel로 배포하기 (가장 간편)

설정이 복잡하다면 Vercel을 사용하세요. 별도의 설정 없이 거의 자동으로 배포됩니다.

1.  [Vercel](https://vercel.com/)에 가입합니다 (GitHub 계정으로 로그인 추천).
2.  **Add New...** -> **Project**를 클릭합니다.
3.  GitHub 저장소를 연결(`Import`)합니다. (위의 '방법 1'의 2단계까지는 진행되어 있어야 합니다)
4.  **Framework Preset**이 `Vite`로 자동 설정됩니다.
5.  **Deploy** 버튼을 누릅니다.
6.  잠시 기다리면 배포가 완료되고 도메인 주소가 생성됩니다.

---

## 주의사항 (Troubleshooting)

*   **새로고침 시 404 에러**: GitHub Pages는 SPA(Single Page Application) 라우팅을 기본적으로 지원하지 않아, `home`이 아닌 다른 페이지에서 새로고침하면 404 에러가 날 수 있습니다. 이 앱은 `HashRouter` 방식이나 단일 페이지 상태 관리를 사용하므로 큰 문제는 없으나, 만약 발생한다면 `HashRouter`를 적용해야 할 수 있습니다. (현재 코드는 상태 기반 라우팅이라 문제없음)
*   **이미지 엑박**: 이미지가 안 보인다면 경로 문제일 수 있습니다. `src` 폴더 내의 이미지를 `import` 해서 사용하거나, `public` 폴더에 넣고 절대 경로(`/`) 대신 상대 경로(`./` 또는 `base` 경로 포함)를 사용해야 합니다.
