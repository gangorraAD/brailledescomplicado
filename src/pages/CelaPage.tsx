import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BrailleCell } from "@/components/BrailleCell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function CelaPage() {
  const { user } = useAuth();
  useEffect(() => {
    document.title = "Cela Braille Interativa — Braille Descomplicado";
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Cela Braille Interativa
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explore os 64 símbolos do Sistema Braille tocando ou clicando nos seis pontos da cela.
          Acessível por toque, mouse e teclado, compatível com leitores de tela.
        </p>
      </header>

      <BrailleCell />

      {user ? (
        <section className="rounded-xl border border-border bg-card/40 p-6">
          <h2 className="text-xl font-semibold text-primary">Continue na oficina</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesse o e-book completo, capítulos, vídeos e materiais exclusivos.
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link to="/sumario">Ir para o sumário</Link>
            </Button>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-border bg-card/40 p-6">
          <h2 className="text-xl font-semibold text-primary">Quer ir além da Cela?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A Cela Interativa é gratuita. Para acessar o e-book completo, capítulos da oficina,
            vídeos, atividades e materiais exclusivos, crie sua conta. O acesso é liberado após
            aprovação do administrador.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/auth">Criar conta gratuita</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/auth">Entrar</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
