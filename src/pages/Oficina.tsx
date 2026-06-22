import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CHAPTERS } from "@/data/chapters";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Hand, Sparkles } from "lucide-react";

const Oficina = () => {
  const [last, setLast] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Braille Descomplicado — Semeando Leitores e Escritores Competentes";
    try {
      setLast(localStorage.getItem("ultimaLeitura"));
    } catch {
      // ignore
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section
        aria-labelledby="hero-title"
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-secondary/40 via-background to-accent/40 p-8 md:p-14 shadow-[var(--shadow-elegant)]"
      >
        <div className="relative z-10 max-w-3xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Edição interativa · 2026
          </p>
          <h1 id="hero-title" className="text-4xl font-bold leading-tight tracking-tight text-primary md:text-6xl">
            Braille Descomplicado
          </h1>
          <p className="mt-3 text-xl font-medium text-foreground/90 md:text-2xl">
            Semeando Leitores e Escritores Competentes
          </p>
          <p className="mt-4 text-lg italic text-muted-foreground">
            Um percurso metodológico, sensorial e significativo
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Luciane Molina · Braillu</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to={`/${last ?? "abertura"}`}>
                {last && last !== "abertura" ? "Continuar leitura" : "Começar leitura"} <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/cela">
                <Hand /> Experimentar a cela interativa
              </Link>
            </Button>
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/40 blur-3xl"
        />
      </section>

      {/* Sumário */}
      <section aria-labelledby="sumario-title" id="sumario" className="mt-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 id="sumario-title" className="text-2xl font-bold text-primary md:text-3xl">
            <BookOpen className="mb-1 mr-2 inline h-6 w-6" /> Sumário
          </h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-2">
          {CHAPTERS.map((c) => (
            <li key={c.slug}>
              <Link
                to={`/${c.slug}`}
                className="group block h-full rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[var(--shadow-soft)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
              >
                {c.number !== undefined && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary/70">
                    Capítulo {c.number}
                  </span>
                )}
                <h3 className="mt-1 text-lg font-semibold text-foreground group-hover:text-primary">
                  {c.title.replace(/^Capítulo \d+: ?/, "")}
                </h3>
                <p className="mt-2 inline-flex items-center text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                  Ler agora <ArrowRight className="ml-1 h-4 w-4" />
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default Oficina;
