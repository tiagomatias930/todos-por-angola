const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { getDb, persist } = require("../database");
const { optionalAuth } = require("../auth");

const router = express.Router();

// ── File upload setup ───────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, "..", "..", "data", "uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  },
});

// ── POST /upload ────────────────────────────────────────────────────
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Nenhum ficheiro enviado." });
  }

  const host = `${req.protocol}://${req.get("host")}`;
  const link = `${host}/uploads/${req.file.filename}`;

  return res.json({
    link,
    url: link,
    fileId: req.file.filename,
  });
});

// ── Helper: run a SELECT and return all rows as objects ─────────────
function queryAll(db, sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function queryOne(db, sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  let row = null;
  if (stmt.step()) {
    row = stmt.getAsObject();
  }
  stmt.free();
  return row;
}

// ── POST /postar_aria ───────────────────────────────────────────────
router.post("/postar_aria", optionalAuth, async (req, res) => {
  try {
    const {
      imagem,
      chuva,
      temperatura,
      tempo,
      enderecoFormatado,
      lat,
      log,
      categoria,
      respostas,
      classificacao,
    } = req.body;

    const id = uuidv4();
    const userId = req.user?.id || null;
    const db = await getDb();

    db.run(
      `INSERT INTO risk_areas
        (id, imagem, chuva, temperatura, tempo, enderecoFormatado, lat, log, categoria, respostas, classificacao, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        imagem || null,
        chuva || null,
        temperatura || null,
        tempo || null,
        enderecoFormatado || null,
        lat || null,
        log || null,
        categoria || null,
        respostas ? JSON.stringify(respostas) : null,
        classificacao ? JSON.stringify(classificacao) : null,
        userId,
      ]
    );
    persist();

    return res.status(201).json({ message: "Ocorrência registada.", id });
  } catch (error) {
    console.error("Erro ao postar área de risco:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// ── GET /buscar_aria_de_risco ───────────────────────────────────────
router.get("/buscar_aria_de_risco", async (_req, res) => {
  try {
    const db = await getDb();
    const rows = queryAll(db, "SELECT * FROM risk_areas ORDER BY created_at DESC");

    const result = rows.map((r) => ({
      id: r.id,
      latitude: r.lat != null ? String(r.lat) : "0",
      longitude: r.log != null ? String(r.log) : "0",
      chuva: r.chuva,
      temperatura: r.temperatura,
      tempo: r.tempo,
      enderecoFormatado: r.enderecoFormatado,
      imagem: r.imagem,
      categoria: r.categoria,
    }));

    return res.json(result);
  } catch (error) {
    console.error("Erro ao buscar áreas de risco:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// ── POST /analisar_aria ─────────────────────────────────────────────
router.post("/analisar_aria", optionalAuth, async (req, res) => {
  try {
    const { ariaDeRisco } = req.body;
    const userId = req.user?.id;

    if (!ariaDeRisco) {
      return res
        .status(400)
        .json({ message: "ID da área de risco é obrigatório." });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Precisa estar autenticado para confirmar." });
    }

    const db = await getDb();

    const area = queryOne(db, "SELECT id FROM risk_areas WHERE id = ?", [ariaDeRisco]);
    if (!area) {
      return res
        .status(404)
        .json({ message: "Área de risco não encontrada." });
    }

    const existing = queryOne(
      db,
      "SELECT id FROM confirmations WHERE risk_area_id = ? AND user_id = ?",
      [ariaDeRisco, userId]
    );

    if (existing) {
      return res
        .status(409)
        .json({ message: "Você já confirmou esta ocorrência recentemente." });
    }

    const id = uuidv4();
    db.run(
      "INSERT INTO confirmations (id, risk_area_id, user_id) VALUES (?, ?, ?)",
      [id, ariaDeRisco, userId]
    );
    persist();

    return res.json({ message: "Confirmação registada com sucesso." });
  } catch (error) {
    console.error("Erro ao confirmar área:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// ── GET /buscar_analise_total ───────────────────────────────────────
router.get("/buscar_analise_total", async (req, res) => {
  try {
    const { ariaDeRisco } = req.query;

    if (!ariaDeRisco) {
      return res.json({ confirmationCount: 0 });
    }

    const db = await getDb();
    const row = queryOne(
      db,
      "SELECT COUNT(*) as count FROM confirmations WHERE risk_area_id = ?",
      [ariaDeRisco]
    );

    return res.json({ confirmationCount: row?.count || 0 });
  } catch (error) {
    console.error("Erro ao buscar contagem:", error);
    return res.status(500).json({ confirmationCount: 0 });
  }
});

module.exports = router;
