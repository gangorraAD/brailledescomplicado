
## Objetivo

Transformar a página inicial do site no **espaço autoral de Luciane Molina (BRAILLU MAIS)** e mover toda a experiência atual da "Oficina Braille Descomplicado" para uma aba/rota separada `/oficina`, mantendo o mesmo visual e tokens de design já existentes.

## Estrutura de rotas (depois da mudança)

```
/              → Página autoral "Luciane Molina | BRAILLU MAIS"  (nova home, pública)
/oficina       → Antiga home da oficina (sumário/CTA, protegida — como hoje é "/")
/sumario       → continua (sumário detalhado)
/cela          → continua (Cela Braille Interativa)
/materiais     → continua
/:slug         → continua (capítulos)
/auth, /admin, /reset-password → continuam
```

A rota `/` deixa de exigir login (página de apresentação pública). A página da oficina (com CTAs de continuar a leitura) passa para `/oficina` e segue protegida por login, como hoje.

## Nova página: Luciane Molina | BRAILLU MAIS

Arquivo novo `src/pages/Autora.tsx` (default na rota `/`). Seções:

1. **Hero autoral** — título "Luciane Molina", sobretítulo "BRAILLU MAIS", uma linha de posicionamento ("Mentoria em Sistema Braille, tecnologia assistiva e acessibilidade na educação") e dois CTAs:
   - Primário: "Entrar na Oficina Braille Descomplicado" → `/oficina`
   - Secundário: "Falar pelo WhatsApp" → link `wa.me` (o mesmo do site BRAILLU MAIS)
2. **Sobre a autora (bio)** — texto biográfico de Luciane Molina + foto (placeholder até o envio).
3. **O que faço / atuação** — 3-4 cartões resumindo a atuação (mentoria, formação docente, acessibilidade em EAD, Braille no planejamento pedagógico), baseados no conteúdo de `braillumais.lovable.app`.
4. **Destaque "Oficina Braille Descomplicado"** — bloco convidando a entrar na oficina (link para `/oficina`).
5. **Contato** — WhatsApp + e-mail/redes (placeholders até o envio).

Conteúdo será extraído de `https://braillumais.lovable.app/` (já consultado) e adaptado. O logo BRAILLU MAIS será adicionado quando você enviar (placeholder com o texto "BRAILLU+" no topo até lá).

## Ajustes na oficina (rota /oficina)

- Mover o conteúdo atual de `src/pages/Index.tsx` para `src/pages/Oficina.tsx` (mesma página, sem mudanças de design — só renomear e re-rotear).
- Atualizar o `localStorage["ultimaLeitura"]` e botões "Continue lendo" para seguirem funcionando dentro de `/oficina`.

## Ajustes de navegação (`src/components/Layout.tsx`)

- Logo do header → passa a linkar para `/` (página autoral).
- Adicionar dois itens principais de navegação no header:
  - **Autora** → `/`
  - **Oficina** → `/oficina`
- Demais links (Sumário, Cela, Materiais, Admin) continuam como hoje, visíveis conforme login/role.
- Sidebar com capítulos só aparece nas rotas da oficina (já é condicionada a usuário logado; manter).

## Ajustes de roteamento (`src/App.tsx`)

- `/` → `<Autora />` (pública, sem `ProtectedRoute`).
- `/oficina` → `<ProtectedRoute><Oficina /></ProtectedRoute>` (o que hoje é `/`).
- Resto inalterado.

## SEO

- `<title>` da home: "Luciane Molina | BRAILLU MAIS — Braille, acessibilidade e educação".
- Meta description curta sobre mentoria em Braille e acessibilidade.
- Um único `<h1>` por página.

## O que NÃO muda

- Design system, cores, tipografia, componentes shadcn.
- Toda a lógica da oficina, Cela Braille, Materiais, Admin, autenticação e Lovable Cloud.
- Dados em `src/data/*` e `BrailleCell` (mantidos exatamente como estão).

## Pendências de conteúdo (depois de implementar)

Você ainda precisa enviar:
- Logo oficial BRAILLU MAIS (PNG/SVG) — entra no hero e no header.
- Foto da Luciane para a seção "Sobre a autora".
- Texto final da bio, se quiser ajustar o rascunho extraído do site BRAILLU MAIS.
- Links definitivos de contato/redes (WhatsApp, Instagram, LinkedIn, e-mail).

Enquanto não chegam, entram placeholders com o conteúdo do site `braillumais.lovable.app` para você revisar visualmente.
