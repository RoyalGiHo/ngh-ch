const express = require("express");
const Database = require("better-sqlite3");
const cors = require("cors");

const app = express();
const db = new Database("todos.db");

app.use(cors());
app.use(express.json());

// Tạo bảng nếu chưa có
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    done INTEGER DEFAULT 0
  )
`);

// Lấy tất cả todo
app.get("/todos", (req, res) => {
  const todos = db.prepare("SELECT * FROM todos").all();
  res.json(todos);
});

// Thêm todo mới
app.post("/todos", (req, res) => {
  const { text } = req.body;
  const result = db.prepare("INSERT INTO todos (text) VALUES (?)").run(text);
  res.json({ id: result.lastInsertRowid, text, done: 0 });
});

// Xoá todo
app.delete("/todos/:id", (req, res) => {
  db.prepare("DELETE FROM todos WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server chạy tại port ${PORT}`));
