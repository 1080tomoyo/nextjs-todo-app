# Next.js TODO アプリ

「Next.js（Route Handler）でTODOリストを作ろう」という課題に沿って、
認証機能・マイページを除くすべての仕様を満たす TODO アプリを実装しました。

---

## 🚩 ホーム画面について

本アプリのメイン画面は **`/todos`** です。  
`/` にアクセスすると自動で `/todos` にリダイレクトされます。

---

## 🚀 使用技術

- Next.js 16（App Router）
- TypeScript
- Tailwind CSS
- Prisma ORM + SQLite
- Route Handler（API）
- Context API（状態管理）

---

## ✨ 実装機能

### ■ TODO一覧（/todos）
- TODO一覧表示（カードUI）
- ステータスバッジ（未完了 / 途中 / 完了）
- フィルター機能
- ソート機能（新しい順 / 古い順）
- 詳細ページへの遷移

### ■ TODO作成（/todos/create）
- タイトル（50文字以内）
- 内容（100文字以内）
- ステータス選択
- 作成後、一覧へリダイレクト

### ■ TODO詳細（/todos/[id]）
- タイトル / 内容 / ステータス表示
- 編集ボタン
- 削除ボタン

### ■ TODO編集（/todos/[id]/edit）
- 既存データをフォームへセット
- 更新後、詳細ページに戻る
