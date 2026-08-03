# LinkPage — Plataforma de páginas de links (estilo Linktree)

SaaS multi-usuário onde qualquer pessoa cria conta e ganha uma página de
links personalizável em `seusite.com/seu-usuario`. O painel admin permite
editar tudo visualmente: links, ícones, cores, fundo (cor/gradiente/imagem),
fonte, estilo dos botões e efeito hover — com preview ao vivo.

Baseado no design original do projeto **GYM W5 Links** (visual neon/glass em
HTML/CSS puro), agora transformado em uma plataforma multi-tenant com Next.js.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Prisma** + SQLite em dev / **PostgreSQL** recomendado em produção
- **Auth.js (NextAuth v5)** — login por email/senha
- **Tailwind CSS 4** — estilização do painel admin
- **dnd-kit** — reordenar links por arrastar
- **react-colorful** — seletor de cores

## Rodando localmente

Pré-requisito: Node.js 20.9+ instalado.

```bash
# 1. Instalar dependências (isso também gera o Prisma Client)
npm install

# 2. Criar o banco de dados local (SQLite) a partir do schema
npm run db:push

# 3. Rodar em desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`. Crie uma conta em `/register`, você será
redirecionado automaticamente para `/admin`. Sua página pública fica em
`http://localhost:3000/seu-usuario`.

> Se `npm install` falhar ao baixar os binários do Prisma por causa de rede
> restrita/firewall corporativo, rode novamente em uma rede sem bloqueios —
> o Prisma precisa baixar o "engine" na primeira instalação.

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste:

```
DATABASE_URL="file:./dev.db"          # ou a URL do Postgres em produção
AUTH_SECRET="gere-um-valor-aleatorio" # ex: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"  # URL da sua aplicação
```

## Deploy na Vercel (recomendado)

1. Suba este projeto para um repositório no GitHub.
2. Crie um banco Postgres gerenciado — [Vercel Postgres](https://vercel.com/storage/postgres),
   [Neon](https://neon.tech) ou [Supabase](https://supabase.com) (todos têm plano free).
3. No `prisma/schema.prisma`, troque:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Importe o projeto na [Vercel](https://vercel.com/new), configure as
   variáveis de ambiente (`DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL` com a
   URL final do deploy).
5. No primeiro deploy, rode `npx prisma db push` apontando para a
   `DATABASE_URL` de produção (localmente, com o `.env` de produção) para
   criar as tabelas.

## Estrutura do projeto

```
prisma/schema.prisma        modelos: User, Page, LinkItem, SocialIcon
src/app/(auth)/login        página de login
src/app/(auth)/register     página de cadastro
src/app/admin               painel admin (protegido por sessão)
src/app/[username]          página pública de cada usuário
src/app/api/...             rotas da API (auth, page, links, social-icons)
src/components              PublicLinkPage (renderiza a página pública)
src/components/admin        abas do painel: Links, Redes sociais, Aparência, Perfil
src/lib                     prisma client, auth config, validação, tipos
```

## Painel administrativo

O painel foi redesenhado com foco em clareza, velocidade e uso em dispositivos
móveis. A navegação agora separa conteúdo, personalização e configurações; o
preview permanece fixo no desktop e abre em uma gaveta dedicada no celular.

- **Links:** criação, edição, ativação, exclusão, upload de ícone e ordenação por arrastar.
- **Redes sociais:** inclusão de canais, edição do destino e ícone personalizado.
- **Aparência:** controles organizados em Fundo, Tipografia, Botões e Efeitos.
- **Perfil:** foto, nome, bio, endereço público e controle de publicação.
- **Salvamento:** indicador visual para estados salvando, salvo e erro.

## Como funciona a customização

Cada `Page` no banco guarda todos os valores de estilo (cores, fonte,
fundo, arredondamento de botão, cor de hover etc). O componente
`PublicLinkPage` lê esses valores e monta o CSS dinamicamente via CSS
variables — o mesmo componente é usado tanto na página pública quanto no
preview ao vivo do painel admin, então o que você edita é exatamente o
que fica publicado.

## Sobre upload de imagens (importante para produção)

Para simplificar o MVP, as imagens (foto de perfil, fundo, ícones customizados)
são salvas como `base64` diretamente no banco de dados. Isso funciona em
qualquer ambiente sem configuração extra, mas não é o ideal em escala (deixa
o banco pesado e a página mais lenta de carregar).

Para produção com muitos usuários, recomenda-se trocar por um serviço de
armazenamento de arquivos, salvando apenas a URL no banco:

- Vercel Blob (mais simples de integrar na Vercel)
- Cloudinary (inclui otimização automática de imagem)
- UploadThing

O ponto de troca fica isolado em `src/components/admin/ImageUploadField.tsx`
(função `handleFile`) — hoje ela converte o arquivo para base64; bastaria
trocar por um upload para o serviço escolhido e passar a URL retornada.

## Próximos passos sugeridos

- Página 404 customizada para usuários inexistentes ou não publicados
- Contagem de cliques por link (o campo `clicks` já existe no schema)
- Limite de plano (free vs pago) usando um campo `plan` no `User`
- Multi-idioma
- Domínio customizado por usuário
