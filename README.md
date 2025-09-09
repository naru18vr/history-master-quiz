---

# 歴史マスタークイズ

日本史を「時代ごと × 暗記 → 四択クイズ」で学べるシングルページアプリ（SPA）。
**Vite + React + TypeScript + Tailwind CSS**。学習進捗は **localStorage** に保存。

公開URL（GitHub Pages）
`https://<your-account>.github.io/history-master-quiz/`

> ⚠️ 公開URLの `<your-account>` は自分のGitHubユーザー名に置き換えてください。

---

## 🧱 技術スタック

* Framework: React (TypeScript)
* Build: Vite
* Styling: Tailwind CSS
* State: React Hooks（`App.tsx` 集約）
* Persistence: `localStorage`（理解度/履歴）

---

## 📦 セットアップ

```bash
# 取得後（またはクローン後）
npm i

# 開発起動
npm run dev
# http://localhost:5173
```

---

## 🗂 ディレクトリ構成（抜粋）

```
src/
├─ App.tsx
├─ index.tsx
├─ index.css
├─ components/
│  ├─ EraSelectionScreen.tsx
│  ├─ MemorizationScreen.tsx
│  ├─ QuizScreen.tsx
│  ├─ ResultsScreen.tsx
│  ├─ HistoryScreen.tsx
│  └─ common/
│     ├─ LoadingSpinner.tsx
│     └─ ProgressBar.tsx
├─ data/
│  ├─ index.ts                # 全時代マップ
│  ├─ asuka/…                 # 各時代のクイズデータ
│  ├─ edo/…
│  └─ …
├─ services/
│  ├─ masteryService.ts       # 習熟（マスター済みID）の永続化
│  └─ historyService.ts       # プレイ履歴の永続化
├─ utils/
│  └─ array.ts                # シャッフルなど
├─ types.ts                   # 型定義（QuizData/QuizTerm など）
└─ vite-env.d.ts              # Vite の型
```

---

## 🧠 アプリ仕様（ざっくり）

* 画面フロー
  **時代選択 → 暗記（カウントダウン）→ クイズ → 結果 → 履歴**
* マスター判定
  1セッションで同一問題に `REQUIRED_CORRECT_ANSWERS` 回連続正解 → マスター扱い（出題プールから除外）
* セッション終了時
  マスター済みIDと総問題数を `localStorage` に保存
* 履歴
  セッションごとに日時・結果を `localStorage` へ追加保存

---

## 💾 localStorage キー

（実装に合わせて必要なら調整）

* `mastery`：各時代ごとの `{ masteredIds: string[], totalTerms: number }`
* `history`：`{ date, era, stats }[]` の配列

### 進捗リセット（開発・デバッグ用）

ブラウザDevTools → Console:

```js
localStorage.clear()
// または
// localStorage.removeItem('mastery'); 
// localStorage.removeItem('history');
```

---

## 🎨 Tailwind 設定

* `tailwind.config.js`

  ```js
  export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: { extend: {} },
    plugins: [],
  }
  ```
* `src/index.css`

  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

> `index.html` に `<link rel="stylesheet" href="/index.css">` は不要（Viteのビルド警告になるため削除済み）。

---

## 🚀 デプロイ（GitHub Pages）

### 1) `vite.config.ts` の `base` をリポ名に合わせる（超重要）

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/history-master-quiz/', // ← リポ名に合わせる
})
```

### 2) 一度だけ（初回）

```bash
git init
git add .
git commit -m "chore: initial commit"
git branch -M main
git remote add origin https://github.com/<your-account>/history-master-quiz.git
git push -u origin main
```

### 3) ビルド & デプロイ

```bash
npm run build
npm run deploy   # gh-pages -d dist
```

### 4) GitHub → Settings → Pages

* Branch: `gh-pages`
* Folder: `(root)`

公開URL：
`https://<your-account>.github.io/history-master-quiz/`

> 以後の更新は「修正 → `git commit` → `git push` → `npm run build` → `npm run deploy`」で反映。

---

## 🧯 トラブルシューティング

* 公開URLが真っ白 / 404

  * `vite.config.ts` の `base` が `/<リポ名>/` になっているか
  * 画像やCSSへの**ルート絶対パス `/assets/...`** を使っていないか

    * 画像は `import imgUrl from './assets/foo.png'` または
      `new URL('./assets/foo.png', import.meta.url).href` を推奨
* 開発時は動くのに本番だけ崩れる

  * 9割 `base` ミス。`'/history-master-quiz/'` を再確認
* `gh-pages` に出ない / `gh-pages` が作られない

  * Git リポ化＆ `origin` 設定＆ `main` push を実行したか
  * `npm run deploy` のログに `Published` が出ているか
* Tailwindが適用されない

  * `src/index.tsx` で `import './index.css'` しているか
  * `tailwind.config.js` の `content` に `./src/**/*.{ts,tsx}` が含まれているか

---

## 🔧 スクリプト

`package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

---

## 🔐 環境変数（必要な場合）

* Viteは `VITE_*` で始まる環境変数のみクライアントへ公開されます
* 例）`.env.local`

  ```
  VITE_API_BASE_URL=https://example.com
  ```

型補完を効かせたい場合は `src/vite-env.d.ts` に

```ts
/// <reference types="vite/client" />
```

必要に応じて `src/import-meta.d.ts` で `ImportMetaEnv` を拡張。

---

## 📝 ライセンス

* 任意（例：MIT）

  ```
  MIT License
  ```

  別ファイル `LICENSE` を作ってもOK。

---

## 🙌 クレジット

* 開発：りさちゃん
* サポート：まっする（筋肉フレンド💪）

---

