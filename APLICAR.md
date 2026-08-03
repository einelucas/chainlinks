# Patch de personalização e responsividade

Este pacote altera somente as áreas solicitadas:

- preview e página pública responsivos;
- ícone opcional ao criar e editar links;
- campo de cor digitável, além do seletor;
- tamanho global dos botões: pequeno, médio ou grande;
- arredondamento dos botões de 0 a 50px;
- tamanho geral da fonte de 12 a 24px.

## Aplicar

1. Faça um backup ou commit do projeto atual.
2. Copie o conteúdo deste pacote por cima da raiz do projeto, preservando as pastas.
3. Atualize o banco e o Prisma Client:

```powershell
npx prisma format
npx prisma db push
npx prisma generate
```

4. Limpe o cache do Next e inicie o projeto:

```powershell
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue
npm run dev
```

No Linux ou macOS, use:

```bash
rm -rf .next
npm run dev
```

Não é necessário executar `npm install`, porque o patch não adiciona dependências.

## Arquivos alterados

- `prisma/schema.prisma`
- `src/lib/types.ts`
- `src/app/api/page/route.ts`
- `src/app/admin/page.tsx`
- `src/app/[username]/page.tsx`
- `src/components/admin/AppearanceTab.tsx`
- `src/components/admin/ColorField.tsx`
- `src/components/admin/LinksTab.tsx`
- `src/components/admin/LivePreview.tsx`
- `src/components/PublicLinkPage.tsx`
- `src/components/PublicLinkPage.module.css`

## Banco de dados

Foram adicionados à tabela `Page`:

- `fontSize Int @default(16)`
- `buttonSize String @default("medium")`

O valor padrão de `buttonRadius` passa a ser `50`.
Perfis antigos que ainda tenham `999` armazenado são limitados visualmente a `50px` pelo componente e passam a salvar um valor entre 0 e 50 quando o controle for alterado.
