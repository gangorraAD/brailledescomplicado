import { ReactNode, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { CHAPTERS } from "@/data/chapters";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrailleLogo } from "@/components/BrailleLogo";
import { useAuth } from "@/hooks/useAuth";

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const { user, profile, isAdmin, signOut } = useAuth();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo principal
      </a>

      {/* Header */}
      <header
        role="banner"
        className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 group" aria-label="Luciane Molina — BRAILLU MAIS">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-[var(--shadow-soft)]"
            >
              <BrailleLogo className="h-6 w-5" />
            </span>
            <span className="font-semibold tracking-tight text-primary">
              Luciane Molina <span className="font-light text-foreground">| BRAILLU MAIS</span>
            </span>
          </Link>
          <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
            <NavLink to="/" end className={({ isActive }) => navClass(isActive)}>
              Autora
            </NavLink>
            {user && (
              <>
                <NavLink to="/oficina" className={({ isActive }) => navClass(isActive)}>
                  Oficina
                </NavLink>
                <NavLink to="/sumario" className={({ isActive }) => navClass(isActive)}>
                  Sumário
                </NavLink>
              </>
            )}
            <NavLink to="/cela" className={({ isActive }) => navClass(isActive)}>
              Cela interativa
            </NavLink>
            {user && (
              <NavLink to="/materiais" className={({ isActive }) => navClass(isActive)}>
                Materiais
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => navClass(isActive)}>
                Admin
              </NavLink>
            )}
            {user ? (
              <>
                <span className="ml-2 text-sm text-muted-foreground">
                  {profile?.nickname ?? profile?.name ?? user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={signOut}>Sair</Button>
              </>
            ) : (
              <NavLink to="/auth" className={({ isActive }) => navClass(isActive)}>
                Entrar
              </NavLink>
            )}
          </nav>
          {user && (
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          )}
        </div>
        {/* Progresso de leitura */}
        <div
          className="h-1 bg-secondary"
          role="progressbar"
          aria-label="Progresso de leitura da página"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/60 transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
        {/* Sidebar desktop — só após login */}
        {user && (
          <aside aria-label="Sumário do livro" className="sticky top-24 hidden h-[calc(100vh-7rem)] w-64 shrink-0 overflow-y-auto lg:block">
            <SidebarNav />
          </aside>
        )}

        {/* Mobile drawer — só após login */}
        {user && open && (
          <div className="fixed inset-0 z-30 lg:hidden" role="dialog" aria-modal="true" aria-label="Sumário">
            <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-[57px] h-[calc(100vh-57px)] w-80 max-w-[85vw] overflow-y-auto bg-card p-4 shadow-xl">
              <SidebarNav />
            </div>
          </div>
        )}

        <main id="conteudo" role="main" className="min-w-0 flex-1">
          {children}
        </main>
      </div>

      <footer role="contentinfo" className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted-foreground">
          <p>
            <strong className="text-primary">Luciane Molina | BRAILLU MAIS</strong> — Oficina Braille Descomplicado · Edição interativa 2026.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <span className="text-muted-foreground">Redes sociais:</span>
            <a
              className="inline-flex items-center gap-1.5 underline hover:text-primary"
              href="https://instagram.com/braillu"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram @braillu"
            >
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              Instagram
            </a>
            <a
              className="inline-flex items-center gap-1.5 underline hover:text-primary"
              href="https://facebook.com/braillu"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook BRAILLU"
            >
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              Facebook
            </a>
            <a
              className="inline-flex items-center gap-1.5 underline hover:text-primary"
              href="https://www.linkedin.com/in/lucianemolina/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn de Luciane Molina"
            >
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </a>
          </div>
          <p className="mt-3">
            Contato: <a className="underline hover:text-primary" href="mailto:braillu@gmail.com">braillu@gmail.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function navClass(isActive: boolean) {
  return cn(
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground",
  );
}

function SidebarNav() {
  return (
    <nav aria-label="Capítulos">
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Sumário
      </p>
      <ul className="space-y-1">
        <li>
          <NavLink to="/oficina" end className={({ isActive }) => sideClass(isActive)}>
            Início da Oficina
          </NavLink>
        </li>
        <li>
          <NavLink to="/cela" className={({ isActive }) => sideClass(isActive)}>
            <span className="inline-flex items-center gap-2">
              <BrailleLogo className="h-4 w-3.5" />
              Cela interativa
            </span>
          </NavLink>
        </li>
        {CHAPTERS.map((c) => (
          <li key={c.slug}>
            <NavLink to={`/${c.slug}`} className={({ isActive }) => sideClass(isActive)}>
              {c.shortTitle}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function sideClass(isActive: boolean) {
  return cn(
    "block rounded-md px-3 py-2 text-sm transition-colors",
    isActive
      ? "bg-primary/10 font-semibold text-primary border-l-4 border-primary"
      : "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
  );
}
