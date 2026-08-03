# Patch do painel `/admin`

Este pacote contém arquivos com a mesma estrutura do projeto. Faça um backup e
copie o conteúdo da pasta do patch sobre a raiz do repositório.

## Arquivos substituídos

- `src/app/admin/page.tsx`
- `src/app/admin/layout.tsx`
- `src/components/admin/AdminTopbar.tsx`
- `src/app/api/page/route.ts`
- `package.json`

## Arquivos adicionados

- `src/app/admin/error.tsx`
- `.env.example`

## Aplicação

```bash
# dentro da raiz do projeto
cp -R /caminho/chainlinks-admin-patch/. ./

# use Node 20.9 ou superior
node --version

# crie o .env somente se ele ainda não existir
test -f .env || cp .env.example .env

npm install
npm run db:push
rm -rf .next
npm run build
npm run dev
```

Acesse `http://localhost:3000/admin` depois de entrar na conta.

## O que o patch corrige

1. O layout do admin deixa de derrubar toda a rota quando a consulta inicial do
   Prisma falha.
2. O painel verifica `response.ok` antes de tratar a resposta da API como uma
   página válida.
3. Respostas 401, 404 e 500 passam a gerar redirecionamento ou erro legível em
   vez de chegar ao preview como um objeto incompleto.
4. A rota `/api/page` passa a capturar erros de banco e JSON inválido.
5. Uma Error Boundary foi adicionada ao segmento `/admin`.
6. O build usa Webpack temporariamente, evitando incompatibilidades do
   Turbopack durante o diagnóstico.
7. O projeto declara Node.js `>=20.9.0`, exigido pelo Next.js 16.

## Vercel / PostgreSQL

Não copie automaticamente o arquivo de `OPCIONAL-VERCEL`. Para produção:

1. Faça backup de `prisma/schema.prisma`.
2. Substitua-o pelo schema completo em `OPCIONAL-VERCEL/prisma/schema.prisma`.
3. Configure `DATABASE_URL`, `AUTH_SECRET` e `NEXTAUTH_URL` na Vercel.
4. Rode `npx prisma db push` ou, preferencialmente, migrations de produção.

SQLite (`file:./dev.db`) não deve ser usado como banco persistente na Vercel.
