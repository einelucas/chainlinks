import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RESERVED_USERNAMES } from "@/lib/validation";

// Deriva um nome de usuário válido (mesma regra de src/lib/validation.ts:
// usernameSchema) a partir do e-mail/nome do Google, garantindo unicidade.
async function generateUniqueUsername(email: string, name?: string | null) {
  const base =
    (name || email.split("@")[0])
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // remove acentos
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9._-]/g, "")
      .slice(0, 25) || "usuario";

  let candidate = base;
  let suffix = 1;

  while (
    RESERVED_USERNAMES.includes(candidate) ||
    candidate.length < 3 ||
    (await prisma.page.findUnique({ where: { username: candidate } }))
  ) {
    suffix += 1;
    candidate = `${base}${suffix}`;
  }

  return candidate;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return true;
      if (!profile?.email) return false;

      let dbUser = await prisma.user.findUnique({ where: { email: profile.email } });

      if (!dbUser) {
        const username = await generateUniqueUsername(
          profile.email,
          typeof profile.name === "string" ? profile.name : undefined
        );

        dbUser = await prisma.user.create({
          data: {
            email: profile.email,
            name: typeof profile.name === "string" ? profile.name : null,
            password: null,
            page: {
              create: {
                username,
                displayName:
                  typeof profile.name === "string" ? profile.name : username,
                profileImage:
                  typeof profile.picture === "string" ? profile.picture : null,
              },
            },
          },
        });
      }

      // Sobrescreve o id do objeto de sessão com o id interno do Prisma
      // (não o id/sub do Google), pra que o callback jwt abaixo monte a
      // sessão com a mesma identidade usada pelo login por senha.
      user.id = dbUser.id;
      return true;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
});
