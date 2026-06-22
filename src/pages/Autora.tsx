import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { ArrowRight, BookOpen, MessageCircle, Hand, Sparkles } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/5512981020340?text=Ol%C3%A1%2C+vim+pela+sua+p%C3%A1gina+e+quero+tornar+meu+curso+acess%C3%ADvel+para+estudantes+cegos.";

const Autora = () => {
  useEffect(() => {
    document.title = "Luciane Molina | BRAILLU MAIS — Braille, acessibilidade e educação";
    const desc =
      "Mentoria educacional e formação em Sistema Braille, tecnologia assistiva e acessibilidade para educação básica, superior e EAD.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  return (
    <div>
      {/* Hero autoral */}
      <section
        aria-labelledby="autora-hero-title"
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-secondary/40 via-background to-accent/40 p-8 md:p-14 shadow-[var(--shadow-elegant)]"
      >
        <div className="relative z-10 max-w-3xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" /> BRAILLU MAIS · Multiplicando ações inclusivas
          </p>
          <h1 id="autora-hero-title" className="text-4xl font-bold leading-tight tracking-tight text-primary md:text-6xl">
            Luciane Molina
          </h1>
          <p className="mt-3 text-xl font-medium text-foreground/90 md:text-2xl">
            Mentoria educacional e curso em Sistema Braille, tecnologia assistiva e acessibilidade para educação e EAD
          </p>
          <p className="mt-4 text-lg italic text-muted-foreground">
            Apoio escolas, universidades, professores e produtores de cursos a eliminarem barreiras
            que impedem estudantes com deficiência visual de aprender com autonomia, qualidade e dignidade.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/oficina">
                <BookOpen /> Entrar na Oficina Braille Descomplicado <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <MessageCircle /> Falar pelo WhatsApp
              </a>
            </Button>
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
      </section>

      {/* Sobre a autora — texto transcrito do site braillumais.lovable.app */}
      <section aria-labelledby="sobre-title" className="mt-12 grid gap-8 md:grid-cols-[260px_1fr] md:items-start">
        <div
          aria-hidden
          className="mx-auto aspect-square w-48 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/40 shadow-[var(--shadow-soft)] md:w-full"
        />
        <div>
          <h2 id="sobre-title" className="text-2xl font-bold text-primary md:text-3xl">
            Luciane Molina
          </h2>
          <p className="mt-2 text-base font-medium text-foreground/80 md:text-lg">
            Doutora e Mestra em Educação · Mentora em Braille, tecnologia assistiva e acessibilidade educacional
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/90 md:text-lg">
            Meu trabalho nasce do encontro entre vivência, pesquisa e prática pedagógica.
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/90 md:text-lg">
            Sou uma pessoa com deficiência visual e atuo com Sistema Braille, tecnologia assistiva, audiodescrição e
            acessibilidade educacional a partir de uma experiência concreta com a cegueira e de uma trajetória dedicada
            à formação de professores, à análise de materiais didáticos e à curadoria de acessibilidade para educação
            presencial e a distância.
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/90 md:text-lg">
            Ao longo dos anos, acompanhei de perto as dificuldades de escolas, universidades e educadores que desejam
            incluir, mas não encontram orientação específica sobre como ensinar Braille, como articular seu uso com a
            tecnologia assistiva e como produzir materiais realmente utilizáveis por estudantes cegos.
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/90 md:text-lg">
            Essa atuação é sustentada por produção acadêmica, participação em pesquisas, publicações, formações e
            projetos voltados à educação inclusiva e à acessibilidade para pessoas com deficiência visual.
          </p>
          <div className="mt-4">
            <a
              href="http://lattes.cnpq.br/5778300198160920"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Ver currículo completo no Lattes
            </a>
          </div>
        </div>
      </section>

      {/* Destaque Oficina */}
      <section
        aria-labelledby="oficina-destaque-title"
        className="mt-14 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-accent/30 p-8 md:p-12"
      >
        <div className="max-w-3xl">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <BookOpen className="h-3.5 w-3.5" /> Oficina interativa
          </p>
          <h2 id="oficina-destaque-title" className="text-2xl font-bold text-primary md:text-3xl">
            Oficina Braille Descomplicado
          </h2>
          <p className="mt-3 text-base text-foreground/90 md:text-lg">
            Um percurso metodológico, sensorial e significativo para semear leitores e escritores
            competentes do Sistema Braille.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/oficina">
                Acessar a oficina <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/cela">
                <Hand /> Experimentar a cela interativa
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Placeholder — aguardando conteúdo exato do usuário */}
      <section className="mt-14 mb-4 rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Aguardando conteúdo adicional enviado pelo usuário.
        </p>
      </section>
    </div>
  );
};

export default Autora;
