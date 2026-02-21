const express = require("express");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { getDb, persist } = require("../database");
const { generateToken } = require("../auth");

const router = express.Router();
const SALT_ROUNDS = 10;

// ── POST /login ─────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { telefone, password } = req.body;

    if (!telefone || !password) {
      return res
        .status(400)
        .json({ message: "Telefone e password são obrigatórios." });
    }

    const db = await getDb();
    const stmt = db.prepare("SELECT * FROM users WHERE telefone = ?");
    stmt.bind([telefone]);
    
    let user = null;
    if (stmt.step()) {
      const row = stmt.getAsObject();
      user = row;
    }
    stmt.free();

    if (!user) {
      return res
        .status(401)
        .json({ message: "Credenciais inválidas." });
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ message: "Credenciais inválidas." });
    }

    const token = generateToken(user);
    return res.json({ token, nome: user.nome, id: user.id });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// ── POST /cadastro ──────────────────────────────────────────────────
router.post("/cadastro", async (req, res) => {
  try {
    const { nome, email, telefone, password } = req.body;

    if (!nome || !email || !telefone || !password) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    const db = await getDb();

    // Check duplicates
    const check = db.prepare("SELECT id FROM users WHERE email = ? OR telefone = ?");
    check.bind([email, telefone]);
    const exists = check.step();
    check.free();

    if (exists) {
      return res
        .status(409)
        .json({ message: "Já existe uma conta com este NIF ou telefone." });
    }

    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
    const id = uuidv4();

    db.run(
      "INSERT INTO users (id, nome, email, telefone, password) VALUES (?, ?, ?, ?, ?)",
      [id, nome, email, telefone, hashedPassword]
    );
    persist();

    return res.status(201).json({ message: "Conta criada com sucesso.", id });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

module.exports = router;
