import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { ArrowRight, BookOpen, GraduationCap, Accessibility, MessageCircle, Hand, Sparkles, Mail, Instagram } from "lucide-react";

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
            Mentoria em Sistema Braille, tecnologia assistiva e acessibilidade na educação
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

      {/* Sobre a autora */}
      <section aria-labelledby="sobre-title" className="mt-12 grid gap-8 md:grid-cols-[260px_1fr] md:items-start">
        <div
          aria-hidden
          className="mx-auto aspect-square w-48 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/40 shadow-[var(--shadow-soft)] md:w-full"
        />
        <div>
          <h2 id="sobre-title" className="text-2xl font-bold text-primary md:text-3xl">
            Sobre a autora
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/90 md:text-lg">
            Luciane Molina é educadora dedicada ao Sistema Braille, à tecnologia assistiva e à acessibilidade na
            educação. Atua na formação de professores e na consultoria pedagógica para escolas, universidades e
            produtores de cursos EAD, garantindo que estudantes com deficiência visual aprendam com autonomia,
            participação e equidade — da educação básica ao ensino superior.
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
            Sob a marca <strong className="text-primary">BRAILLU MAIS</strong>, desenvolve mentorias, materiais e
            oficinas que colocam o Braille no centro das decisões pedagógicas — não como complemento, mas como
            ponto de partida para um ensino verdadeiramente acessível.
          </p>
        </div>
      </section>

      {/* Atuação */}
      <section aria-labelledby="atuacao-title" className="mt-14">
        <h2 id="atuacao-title" className="text-2xl font-bold text-primary md:text-3xl">
          O que faço
        </h2>
        <p className="mt-2 text-muted-foreground">
          Atuação multiplicadora para tornar a educação acessível desde o planejamento.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            {
              icon: GraduationCap,
              title: "Mentoria e formação docente",
              text: "Acompanhamento de professores e equipes pedagógicas para integrar o Braille à prática diária.",
            },
            {
              icon: Accessibility,
              title: "Acessibilidade em EAD",
              text: "Consultoria para produtores de cursos online tornarem materiais e plataformas acessíveis a estudantes cegos.",
            },
            {
              icon: BookOpen,
              title: "Sistema Braille no planejamento",
              text: "O Braille como decisão pedagógica desde o início — não como adaptação tardia.",
            },
            {
              icon: Hand,
              title: "Tecnologia assistiva",
              text: "Escolha e uso consciente de recursos que ampliam — e não substituem — a leitura e a escrita.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[var(--shadow-soft)]"
            >
              <Icon className="h-6 w-6 text-primary" aria-hidden />
              <h3 className="mt-3 text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </article>
          ))}
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

      {/* Contato */}
      <section aria-labelledby="contato-title" className="mt-14 mb-4">
        <h2 id="contato-title" className="text-2xl font-bold text-primary md:text-3xl">
          Vamos conversar
        </h2>
        <p className="mt-2 text-muted-foreground">
          Quer tornar sua prática pedagógica acessível? Fale comigo.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <MessageCircle /> WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="mailto:braillu@gmail.com">
              <Mail /> braillu@gmail.com
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="https://instagram.com/braillu" target="_blank" rel="noreferrer">
              <Instagram /> @braillu
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Autora;