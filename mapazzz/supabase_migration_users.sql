-- =============================================
-- Tabela de utilizadores para Nova Angola
-- Execute este SQL no Supabase Dashboard > SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS users (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,          -- NIF do utilizador
  telefone   TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL,                 -- Em produção, usar hashing no backend
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para buscas rápidas
CREATE INDEX IF NOT EXISTS idx_users_telefone ON users (telefone);
CREATE INDEX IF NOT EXISTS idx_users_email    ON users (email);

-- Habilitar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: permitir INSERT anónimo (para registo)
CREATE POLICY "Permitir registo de utilizadores"
  ON users FOR INSERT
  WITH CHECK (true);

-- Política: permitir SELECT anónimo (para login)
CREATE POLICY "Permitir leitura para login"
  ON users FOR SELECT
  USING (true);
