# Life · 每日儀式 — 安裝到手機的步驟

這個資料夾是一個完整的網頁 App 專案。照著下面做，就能把它放到手機主畫面，像一般 App 一樣使用。

---

## 方法一：部署到 Vercel（推薦，全程免費，約 10 分鐘）

### 事前準備
- 一個 GitHub 帳號（github.com 免費註冊）
- 一個 Vercel 帳號（vercel.com，可直接用 GitHub 登入）

### 步驟

1. **把這個資料夾上傳到 GitHub**
   - 到 github.com 按右上角「+」→「New repository」
   - 名稱隨意（例如 `life-app`），按「Create repository」
   - 頁面上選「uploading an existing file」，把這個資料夾裡的**所有檔案**拖進去（注意：是資料夾裡面的內容，不是整個資料夾）
   - 按「Commit changes」

2. **用 Vercel 部署**
   - 到 vercel.com 用 GitHub 帳號登入
   - 按「Add New…」→「Project」
   - 選剛剛建立的 `life-app` repository，按「Import」
   - 什麼都不用改，直接按「Deploy」
   - 等大約一分鐘，會得到一個網址，例如 `https://life-app-xxxx.vercel.app`

3. **加到手機主畫面**
   - 用 iPhone 的 **Safari** 打開那個網址（一定要 Safari，Chrome 沒有這功能）
   - 點下方中間的「分享」按鈕（方框加箭頭）
   - 往下捲，點「**加入主畫面**」
   - 按「加入」

完成！主畫面會出現 Life 的圖示，點開就是全螢幕的 App。

---

## 方法二：在自己電腦上先跑起來看看（開發者用）

需要先安裝 Node.js（nodejs.org 下載 LTS 版）。

```bash
cd life-app-web
npm install
npm run dev
```

打開顯示的網址（通常是 http://localhost:5173）即可。

要產生正式版檔案：

```bash
npm run build
```

產出的 `dist/` 資料夾就是可以放到任何靜態網站空間的成品。

---

## 常見問題

**Q：資料存在哪裡？換手機會不見嗎？**
資料存在手機瀏覽器的 localStorage 裡（只在你的裝置上）。清除 Safari 網站資料或換手機，資料就會不見。正式產品需要串接雲端備份。

**Q：推播通知會響嗎？**
還不會。設定頁的時間會被記住，但真正的系統推播需要進一步實作（PWA 推播或原生 App），這是下一階段的工程。

**Q：音樂沒有聲音？**
先點左下角的音符按鈕開啟，並確認手機側邊的靜音鍵沒有開啟靜音、音量有開。

**Q：想上架 App Store？**
需要用 Capacitor 之類的工具把這個網頁包成原生 App，加上 Apple 開發者帳號（99 美元/年）。到那個階段推播、FaceID 也才能真正實作。
