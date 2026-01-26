# Monorepo Bun

Monorepo usando Bun workspaces com packages TypeScript compartilhados (sem necessidade de builds).

## Estrutura

```
monorepo-bun/
├── apps/
│   ├── server/         # Elysia + Bun
│   └── web/            # React + Vite + TanStack Router + SSR
└── packages/
    ├── api/            # Módulos backend compartilhados
    ├── ui/             # Componentes React (Tailwind + shadcn/ui)
    └── config/         # Configurações (Biome, TypeScript)
```

## Instalação

```bash
bun install
```

## Desenvolvimento

Rodar todos os serviços com concurrently (logs coloridos):
```bash
bun dev
```
- Backend: logs em **azul**
- Frontend: logs em **verde**

Rodar individualmente:
```bash
bun dev:server  # Apenas backend (porta 3000)
bun dev:web     # Apenas frontend (porta 3001)
```

## Features

- **Bun Workspaces**: Gerenciamento de monorepo nativo
- **TypeScript direto**: Packages usados sem transpilação/build
- **Elysia**: Backend rápido e type-safe
- **React 18**: Com SSR via TanStack Start
- **TanStack Router**: Routing moderno com type-safety
- **Server Functions**: Lógica server-side no frontend
- **Tailwind CSS**: Styling utility-first
- **shadcn/ui**: Componentes acessíveis e customizáveis
- **Biome**: Linting e formatting ultra-rápido
- **Hot Reload**: Em todos os packages e apps
- **Concurrently**: Dev servers rodando simultaneamente com logs coloridos

## Scripts

- `bun dev` - Inicia dev server de todos os apps
- `bun lint` - Roda Biome em todo o projeto
- `bun format` - Formata código com Biome
- `bun typecheck` - Verifica tipos TypeScript

## Packages

### @monorepo/config
Configurações compartilhadas (Biome, TypeScript).

### @monorepo/api
Schemas, types e utils compartilhados entre front e back.

### @monorepo/ui
Componentes React reutilizáveis com Tailwind CSS.

---

Para mais detalhes sobre desenvolvimento, veja [DESENVOLVIMENTO.md](./DESENVOLVIMENTO.md).
