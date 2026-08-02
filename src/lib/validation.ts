import { z } from "zod";

// Reservamos algumas rotas para não conflitar com páginas do sistema
export const RESERVED_USERNAMES = [
  "admin",
  "login",
  "register",
  "api",
  "app",
  "www",
  "assets",
  "static",
  "public",
  "dashboard",
  "settings",
  "help",
  "suporte",
  "termos",
  "privacidade",
];

export const usernameSchema = z
  .string()
  .min(3, "O usuário precisa ter pelo menos 3 caracteres")
  .max(30, "O usuário pode ter no máximo 30 caracteres")
  .regex(
    /^[a-z0-9._-]+$/,
    "Use apenas letras minúsculas, números, ponto, hífen ou underline"
  )
  .refine((val) => !RESERVED_USERNAMES.includes(val), {
    message: "Esse nome de usuário é reservado",
  });

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.string().email("Email inválido"),
  username: usernameSchema,
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
});
