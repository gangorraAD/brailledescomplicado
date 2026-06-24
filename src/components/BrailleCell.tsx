import { useEffect, useMemo, useRef, useState } from "react";
import { lookupSign, dotsToMask, maskToUnicode, ALL_SIGNS, speechFor } from "@/data/braille";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mode = "livre" | "treino" | "desafio";

interface Props {
  size?: "md" | "lg";
}

// Ordem de leitura (DOM e leitor de tela): 1, 2, 3, 4, 5, 6
// Layout visual: 2 colunas x 3 linhas, preenchidas por coluna
// (esquerda cima→baixo: 1,2,3 | direita cima→baixo: 4,5,6)
const READING_ORDER = [1, 2, 3, 4, 5, 6];

export function BrailleCell({ size = "lg" }: Props) {
  const [active, setActive] = useState<Set<number>>(new Set());
  const [mode, setMode] = useState<Mode>("livre");
  const [target, setTarget] = useState<{ letter: string; mask: number } | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [score, setScore] = useState({ acertos: 0, total: 0 });
  
  const liveRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const wrongPlayedRef = useRef<number>(-1);
  const livrePlayedRef = useRef<number>(0);

  const getAudioCtx = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined;
      if (!Ctx) return null;
      audioCtxRef.current = new Ctx();
    }
    return audioCtxRef.current;
  };

  const playTone = (freqs: number[], duration = 0.18, type: OscillatorType = "sine") => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = f;
      const start = now + i * duration * 0.9;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.02);
    });
  };

  const playCorrect = () => playTone([659.25, 987.77], 0.18, "triangle"); // E5 → B5
  const playWrong = () => playTone([196, 155.56], 0.22, "sawtooth"); // G3 → Eb3

  const mask = useMemo(() => dotsToMask(Array.from(active)), [active]);
  const sign = lookupSign(mask);
  const spoken = useMemo(() => speechFor(sign), [sign]);

  const toggle = (dot: number) => {
    setActive((prev) => {
      const n = new Set(prev);
      if (n.has(dot)) n.delete(dot);
      else n.add(dot);
      return n;
    });
  };

  const clear = () => setActive(new Set());

  // Modo treino/desafio: gerar alvo aleatório (apenas letras a-z)
  const pickTarget = () => {
    const letters = ALL_SIGNS.filter((s) => s.letter && /^[a-zçãõáéíóúâêîôûü]$/.test(s.letter));
    const r = letters[Math.floor(Math.random() * letters.length)];
    setTarget({ letter: r.letter!, mask: r.mask });
    setFeedback("");
    clear();
  };

  useEffect(() => {
    if (mode === "treino" || mode === "desafio") pickTarget();
    else setTarget(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Verificar resposta no modo treino/desafio
  useEffect(() => {
    if (!target) return;
    if (mask === 0) return;
    if (mask === target.mask) {
      setFeedback(`Correto! Você formou a letra "${target.letter.toUpperCase()}".`);
      setScore((s) => ({ acertos: s.acertos + 1, total: s.total + 1 }));
      playCorrect();
      wrongPlayedRef.current = -1;
      const t = setTimeout(pickTarget, 1200);
      return () => clearTimeout(t);
    }
    // Errou: dots iguais ou superiores ao alvo, mas máscara diferente
    if (active.size >= target.mask.toString(2).split("1").length - 1) {
      if (wrongPlayedRef.current !== mask) {
        wrongPlayedRef.current = mask;
        playWrong();
        setFeedback(`Ainda não. Continue tentando formar "${target.letter.toUpperCase()}".`);
      }
    }
  }, [mask, target]);

  // Anuncia mudança para leitor de tela + síntese de voz (mesma fonte de verdade)
  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = sign.description;
    }
    // Log para validação de testes
    // eslint-disable-next-line no-console
    console.debug("[BrailleCell]", {
      dots: sign.dots,
      mask: sign.mask,
      symbol: sign.symbol,
      letter: sign.letter,
      speech: spoken,
    });
    // Feedback sonoro no modo livre: positivo se a composição corresponde
    // a um sinal conhecido (letra, número ou símbolo), negativo caso contrário.
    if (mode === "livre" && mask !== 0 && livrePlayedRef.current !== mask) {
      livrePlayedRef.current = mask;
      const reconhecido = Boolean(sign.letter || sign.number || sign.symbol);
      if (reconhecido) playCorrect();
      else playWrong();
    }
    if (mask === 0) livrePlayedRef.current = 0;
    if (!speakOn) return;
    if (mask === 0) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(spoken);
      u.lang = "pt-BR";
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    } catch {
      /* noop */
    }
  }, [sign, spoken, speakOn, mask]);

  const handleKey = (e: React.KeyboardEvent, dot: number) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle(dot);
    }
  };

  const dotSize = size === "lg" ? "h-16 w-16 md:h-20 md:w-20" : "h-12 w-12";

  return (
    <section
      aria-labelledby="cela-interativa-title"
      className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-[var(--shadow-soft)]"
    >
      <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 id="cela-interativa-title" className="text-2xl font-semibold text-primary">
            Cela Braille Interativa
          </h3>
          <p className="text-sm text-muted-foreground">
            Toque nos seis pontos para ativar e desativar. Funciona com toque, mouse e teclado.
          </p>
        </div>
        <div role="group" aria-label="Modos da cela" className="flex flex-wrap gap-2">
          {(["livre", "treino", "desafio"] as Mode[]).map((m) => (
            <Button
              key={m}
              variant={mode === m ? "default" : "outline"}
              size="sm"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
            >
              {m === "livre" ? "Modo livre" : m === "treino" ? "Modo treino" : "Desafio"}
            </Button>
          ))}
          <Button
            variant={speakOn ? "default" : "outline"}
            size="sm"
            onClick={() => setSpeakOn((v) => !v)}
            aria-pressed={speakOn}
            aria-label={speakOn ? "Desligar voz" : "Ligar voz"}
          >
            {speakOn ? "Voz: ligada" : "Voz: desligada"}
          </Button>
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        {/* Cela */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="grid grid-cols-2 grid-rows-3 grid-flow-col gap-4 rounded-2xl bg-gradient-to-br from-secondary/60 to-accent/60 p-6 shadow-inner"
            role="group"
            aria-label="Cela Braille com 6 pontos, na ordem 1, 2, 3, 4, 5, 6"
          >
            {READING_ORDER.map((dot) => {
              const on = active.has(dot);
              return (
                <button
                  key={dot}
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={`Ponto ${dot}${on ? " ativo" : " inativo"}`}
                  onClick={() => toggle(dot)}
                  onKeyDown={(e) => handleKey(e, dot)}
                  className={cn(
                    "rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60",
                    dotSize,
                    on
                      ? "border-primary bg-primary shadow-[var(--shadow-glow)] scale-105"
                      : "border-border bg-background hover:border-primary/60",
                  )}
                >
                  <span className="sr-only">Ponto {dot}</span>
                  <span aria-hidden className="block text-center text-xs font-semibold opacity-50">
                    {dot}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clear}>
              Limpar
            </Button>
          </div>
        </div>

        {/* Resultado */}
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Símbolo</p>
            <div className="flex items-baseline gap-4">
              <p
                aria-hidden
                className="font-mono text-6xl leading-none text-primary"
                style={{ fontFamily: "'Apple Symbols', 'Segoe UI Symbol', monospace" }}
              >
                {maskToUnicode(mask)}
              </p>
              {sign.symbol && (
                <p aria-hidden className="text-3xl font-semibold text-foreground">
                  {sign.symbol}
                </p>
              )}
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-secondary/60 p-3">
              <dt className="text-xs text-muted-foreground">Pontos</dt>
              <dd className="font-medium">{sign.dots.length ? sign.dots.join(", ") : "—"}</dd>
            </div>
            <div className="rounded-lg bg-secondary/60 p-3">
              <dt className="text-xs text-muted-foreground">Letra/Símbolo</dt>
              <dd className="font-medium">{sign.letter?.toUpperCase() ?? sign.symbol ?? "—"}</dd>
            </div>
            <div className="rounded-lg bg-secondary/60 p-3">
              <dt className="text-xs text-muted-foreground">Número</dt>
              <dd className="font-medium">{sign.number ?? "—"}</dd>
            </div>
            <div className="rounded-lg bg-secondary/60 p-3">
              <dt className="text-xs text-muted-foreground">Matemática</dt>
              <dd className="font-medium">{sign.mathMeaning ?? "—"}</dd>
            </div>
          </dl>
          <p className="rounded-lg bg-accent/40 p-3 text-sm text-accent-foreground">
            {sign.description}
          </p>
          <p className="text-xs text-muted-foreground">
            Falado: <span className="font-medium">{spoken}</span>
          </p>

          {target && (
            <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-4">
              <p className="text-sm text-muted-foreground">
                {mode === "treino" ? "Treino" : "Desafio"} — forme a letra:
              </p>
              <p className="text-3xl font-bold uppercase text-primary">{target.letter}</p>
              {feedback && <p className="mt-2 text-sm font-medium text-primary">{feedback}</p>}
              <p className="mt-2 text-xs text-muted-foreground">
                Acertos: {score.acertos} / {score.total}
              </p>
              <Button size="sm" variant="outline" className="mt-2" onClick={pickTarget}>
                Próximo
              </Button>
            </div>
          )}
        </div>
      </div>

      <div ref={liveRef} className="sr-only" aria-live="polite" />
    </section>
  );
}
