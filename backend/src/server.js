const express = require("express");
const cors = require("cors");
const path = require("path");

const { getDb } = require("./database");

const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/reports");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Serve uploaded files as static
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "data", "uploads"))
);

// ── Routes ──────────────────────────────────────────────────────────
app.use(authRoutes);
app.use(reportRoutes);

// ── Health check ────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    app: "Nova Angola Backend",
    version: "1.0.0",
    endpoints: [
      "POST /login",
      "POST /cadastro",
      "POST /upload",
      "POST /postar_aria",
      "POST /analisar_aria",
      "GET  /buscar_aria_de_risco",
      "GET  /buscar_analise_total?ariaDeRisco={id}",
    ],
  });
});

// ── 404 catch-all ───────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: "Rota não encontrada." });
});

// ── Error handler ───────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Erro interno do servidor." });
});

// ── Start ───────────────────────────────────────────────────────────
async function start() {
  await getDb(); // Initialise database & create tables
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🟢  Nova Angola Backend a correr em http://localhost:${PORT}\n`);
    console.log("Endpoints disponíveis:");
    console.log("  POST /login");
    console.log("  POST /cadastro");
    console.log("  POST /upload");
    console.log("  POST /postar_aria");
    console.log("  POST /analisar_aria");
    console.log("  GET  /buscar_aria_de_risco");
    console.log("  GET  /buscar_analise_total?ariaDeRisco={id}");
    console.log("");
  });
}

start().catch((err) => {
  console.error("Falha ao iniciar o servidor:", err);
  process.exit(1);
});
