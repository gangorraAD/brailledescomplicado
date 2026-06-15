## Objetivo

Sim, é totalmente possível. Hoje **toda** a aplicação exige login + aprovação. Vou transformar a **Cela Braille Interativa** em uma vitrine pública (sem login), mantendo todo o restante (e-book, capítulos, materiais, admin) atrás de login.

## O que muda

### 1. Rota pública
- `/cela` deixa de usar `ProtectedRoute` em `src/App.tsx` — vira a única rota livre.
- Demais rotas (`/`, `/sumario`, `/:slug`, `/materiais`, `/admin`) continuam exigindo login e aprovação como hoje.

### 2. Página inicial pública
- Visitante anônimo que acessar `/` é redirecionado para `/cela` em vez de `/auth`, para que a primeira impressão seja o recurso gratuito.
- Em `/cela`, adiciono um bloco de chamada para visitantes não logados:
  - Texto curto explicando que a oficina completa (e-book, capítulos, materiais, atividades) está disponível após cadastro.
  - Botões "Criar conta gratuita" → `/auth` e "Entrar".
- Para usuário já logado, esse bloco é substituído por um atalho "Ir para o Sumário".

### 3. Cabeçalho / navegação
- `Layout.tsx`: quando não há `user`, mostro apenas os links **Cela interativa** e **Entrar** (oculto Início, Sumário, Materiais).
- Sidebar lateral e drawer mobile continuam aparecendo só para logados (já é o comportamento atual).
- Logo no topo aponta para `/cela` quando deslogado, e para `/` quando logado.

### 4. Página de cadastro
- Em `src/pages/Auth.tsx`, ajusto o texto introdutório para deixar claro: "Cadastre-se para acessar o e-book completo, capítulos, vídeos e materiais da oficina. A Cela Interativa permanece gratuita."

### 5. Sem mudanças de backend
- Nenhuma alteração de banco, RLS ou storage. A Cela é 100% client-side, então liberar a rota basta. Materiais, perfis e papéis seguem protegidos como hoje.

## Arquivos afetados
- `src/App.tsx` — remover `ProtectedRoute` de `/cela`; adicionar redirect `/` → `/cela` para anônimos (via wrapper leve ou ajuste no `ProtectedRoute`).
- `src/pages/CelaPage.tsx` — bloco de CTA para visitantes não logados.
- `src/components/Layout.tsx` — menu condicional e destino do logo.
- `src/pages/Auth.tsx` — copy explicando o modelo gratuito + pago.

## Fora de escopo (confirmar depois se quiser)
- Liberar trechos de capítulos no gratuito.
- Página de "planos" ou checkout pago — o fluxo continua sendo aprovação manual pelo admin.
