import { supabase } from './supabase';

export interface User {
  id?: string;
  nome: string;
  email: string;       // NIF
  telefone: string;
  password: string;
  created_at?: string;
}

/**
 * Regista um novo utilizador na tabela "users" do Supabase.
 * Retorna o utilizador criado ou lança um erro.
 */
export async function cadastrarUsuario(
  dados: Omit<User, 'id' | 'created_at'>
): Promise<User> {
  // 1. Verificar se já existe um utilizador com o mesmo telefone ou NIF
  const { data: existente, error: checkError } = await supabase
    .from('users')
    .select('id')
    .or(`telefone.eq.${dados.telefone},email.eq.${dados.email}`)
    .maybeSingle();

  if (checkError) {
    throw new Error('Erro ao verificar utilizador existente: ' + checkError.message);
  }

  if (existente) {
    throw new Error('Já existe uma conta com este telefone ou NIF.');
  }

  // 2. Inserir o novo utilizador
  const { data, error } = await supabase
    .from('users')
    .insert([{
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      password: dados.password,   // Em produção, hash no backend!
    }])
    .select()
    .single();

  if (error) {
    throw new Error('Erro ao criar conta: ' + error.message);
  }

  return data as User;
}

/**
 * Faz login verificando telefone OU NIF + password na tabela "users" do Supabase.
 * Aceita tanto número de telefone quanto NIF no campo identificador.
 * Retorna o utilizador encontrado ou lança um erro.
 */
export async function loginUsuario(
  identificador: string,
  password: string
): Promise<User> {
  // Tentar encontrar por telefone OU por NIF (email)
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`telefone.eq.${identificador},email.eq.${identificador}`)
    .eq('password', password)
    .maybeSingle();

  if (error) {
    throw new Error('Erro ao verificar credenciais: ' + error.message);
  }

  if (!data) {
    throw new Error('Telefone/NIF ou senha incorretos.');
  }

  return data as User;
}

/**
 * Busca um utilizador pelo telefone.
 */
export async function buscarUsuarioPorTelefone(
  telefone: string
): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('telefone', telefone)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar utilizador:', error.message);
    return null;
  }

  return data as User | null;
}

/**
 * Busca um utilizador pelo NIF (email).
 */
export async function buscarUsuarioPorNIF(
  nif: string
): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', nif)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar utilizador:', error.message);
    return null;
  }

  return data as User | null;
}
