import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, MessageCircle, Hand, Sparkles, ExternalLink } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Imagens hospedadas no Lovable Cloud (bucket book-images)
const CLOUD_FOTO_AUTORA =
  "https://ftoenhzwgfyhtecowrkd.supabase.co/storage/v1/object/public/book-images/FOTO_AUTORA.jpg";

// Wrapper que substitui imagens quebradas por um quadro branco com o nome do
// arquivo esperado, para que o editor identifique onde recolocar cada foto.
function SafeImg(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [broken, setBroken] = useState(false);
  const { src, alt, className, ...rest } = props;
  if (broken) {
    const srcStr = typeof src === "string" ? src : "";
    const fileName = srcStr.split("/").pop() || "imagem";
    return (
      <div
        role="img"
        aria-label={typeof alt === "string" ? alt : undefined}
        className={`${className ?? ""} flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border bg-white p-4 text-center`}
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Imagem a recolocar
        </span>
        <span className="break-all font-mono text-xs text-foreground/80">
          {fileName}
        </span>
        {typeof alt === "string" && alt && (
          <span className="text-xs italic text-muted-foreground">{alt}</span>
        )}
      </div>
    );
  }
  return (
    <img
      {...rest}
      src={src}
      alt={alt}
      className={className}
      onError={() => setBroken(true)}
    />
  );
}

const WA_TORNAR_ACESSIVEL =
  "https://wa.me/5512981020340?text=Ol%C3%A1%2C+vim+pela+sua+p%C3%A1gina+e+quero+tornar+meu+curso+acess%C3%ADvel+para+estudantes+cegos.";
const WA_ORIENTACAO_PRATICA =
  "https://wa.me/5512981020340?text=Preciso+de+orienta%C3%A7%C3%A3o+sobre+o+ensino+do+braille+na+minha+pr%C3%A1tica+pedag%C3%B3gica.";
const WA_CURSO_MENTORIA =
  "https://wa.me/5512981020340?text=Quero+informa%C3%A7%C3%B5es+sobre+o+curso+de+braille+e+a+mentoria.";
const WA_INICIAR_MENTORIA =
  "https://wa.me/5512981020340?text=Quero+iniciar+a+mentoria+em+braille.";
const LATTES_URL = "http://lattes.cnpq.br/5778300198160920";

const recursos = [
  { src: "https://ftoenhzwgfyhtecowrkd.supabase.co/storage/v1/object/public/book-images/braillete-01.jpg", alt: "Duas placas azuis de brailletes sobre fundo amarelo, com pinos metálicos encaixados formando palavras em Braille.", caption: "Montagem tátil para explorar letras, palavras e organização dos pontos." },
  { src: "https://ftoenhzwgfyhtecowrkd.supabase.co/storage/v1/object/public/book-images/alfabraille-azul-cinza.jpg", alt: "Alfabraille em azul e cinza.", caption: "Alfabraille como recurso concreto para o ensino." },
  { src: "https://ftoenhzwgfyhtecowrkd.supabase.co/storage/v1/object/public/book-images/jogos-e-bonecos-braille.png", alt: "Cartaz colorido com dois bonecos de mãos dadas com células Braille no peito.", caption: "Propostas lúdicas aproximam crianças e educadores do Sistema Braille." },
  { src: "https://ftoenhzwgfyhtecowrkd.supabase.co/storage/v1/object/public/book-images/reglete.png", alt: "Conjunto de reglete de mesa e reglete de bolso metálicas com punção.", caption: "Regletes e punção seguem essenciais para a escrita manual em Braille." },
  { src: "https://ftoenhzwgfyhtecowrkd.supabase.co/storage/v1/object/public/book-images/placa-braille-latinha-aluminio-sustentabilidade.jpg", alt: "Placas de alumínio com escrita em Braille fixadas sobre base emborrachada preta.", caption: "Acessibilidade também se constrói em sinalização, sustentabilidade e presença social." },
];

const servicos = [
  { n: "01", titulo: "Curso Braille Descomplicado", sub: "Semeando Leitores e Escritores Competentes", texto: "Formação completa para quem precisa aprender Braille de forma pedagógica, compreendendo seu papel na alfabetização, na autonomia e no desenvolvimento acadêmico do estudante com cegueira. Indicado para professores, profissionais da educação, familiares e equipes pedagógicas." },
  { n: "02", titulo: "Mentoria educacional individual", sub: "", texto: "Acompanhamento personalizado para orientar práticas pedagógicas, escolhas de recursos, organização de materiais e decisões relacionadas ao processo de escolarização e/ou reabilitação do estudante com cegueira ou baixa visão de qualquer idade." },
  { n: "03", titulo: "Avaliação de materiais didáticos", sub: "", texto: "Análise técnica e pedagógica de PDFs, apostilas, apresentações, atividades, imagens e recursos utilizados em cursos presenciais e online, da educação básica ao ensino superior." },
  { n: "04", titulo: "Consultorias, palestras e formações", sub: "", texto: "Análises, orientações e formações sob demanda, organizadas conforme a realidade da instituição, do curso ou da equipe." },
];

const galeriaServicos = [
  { src: "https://ftoenhzwgfyhtecowrkd.supabase.co/storage/v1/object/public/book-images/alfabraille-azul-cinza.jpg", alt: "Alfabraille em azul e cinza.", caption: "Alfabraille como recurso concreto para o ensino." },
  { src: "https://ftoenhzwgfyhtecowrkd.supabase.co/storage/v1/object/public/book-images/livro-braille-bricks.jpg", alt: "Blocos LEGO Braille Bricks coloridos espalhados sobre superfície clara.", caption: "Braille Bricks em proposta lúdica de alfabetização." },
  { src: "https://ftoenhzwgfyhtecowrkd.supabase.co/storage/v1/object/public/book-images/luciane-mostrando-cela-braille-em-formacao.jpeg", alt: "Luciane Molina segura um alfabraille gigante em sala de aula.", caption: "Formação com materiais táteis e participação ativa.", objectPos: "object-[center_40%]" },
];

const trajetoria = [
  { src: "/__l5e/assets-v1/5afb552b-7b60-4b01-b636-6306de1aa040/luciane-professora-curso.jpg", alt: "Luciane sentada em sala de aula, lendo uma folha em Braille sobre a mesa.", caption: "Ensino de Braille em contexto formativo." },
  { src: "/__l5e/assets-v1/99d68e6c-2f9f-4e04-be9f-5d606ec541f8/luciane-digitando-braille-na-maquina.jpg", alt: "Luciane sentada em sala de aula, lendo uma folha em Braille sobre a mesa. Demonstração do uso da máquina de escrever em Braille.", caption: "Demonstração do uso da máquina de escrever em Braille." },
  { src: "/__l5e/assets-v1/00a104e9-dbfd-4276-8a09-b2c5ab1aaf63/luciane-mostrando-reglete.jpg", alt: "Quatro adultos em sala de aula ao redor de uma mesa com papéis.", caption: "Formação prática com reglete e acompanhamento de participantes." },
  { src: "/__l5e/assets-v1/59c19c68-51eb-41cf-af7e-dfa091dac202/curso-caragua.jpg", alt: "Adultos sentados em carteiras escrevendo em cadernos.", caption: "Curso com vivências concretas de escrita e aprendizagem." },
  { src: "/luciane-lendo-no-memorial-zoomout.jpg", alt: "Luciane em pé ao lado de um banner em Braille, sorrindo e tocando o painel expositivo.", caption: "Experiência tátil e memória da acessibilidade.", objectPos: "object-[center_30%]" },
  { src: "/__l5e/assets-v1/36f9066d-d308-4831-963f-8fcdad86fc77/defesa-doutorado-usp.jpeg", alt: "Defesa de doutorado em videoconferência.", caption: "Defesa de doutorado e consolidação da trajetória acadêmica." },
];

const passos = [
  { n: 1, titulo: "Diagnóstico da situação atual", texto: "Compreensão das necessidades, das dificuldades e dos recursos já utilizados." },
  { n: 2, titulo: "Análise pedagógica e técnica", texto: "Avaliação das práticas, dos materiais e das decisões relacionadas ao uso do Braille, da tecnologia assistiva e da audiodescrição." },
  { n: 3, titulo: "Orientações personalizadas", texto: "Indicações práticas sobre ensino do Braille, organização de materiais, escolhas de recursos e encaminhamentos pedagógicos." },
  { n: 4, titulo: "Acompanhamento", texto: "Espaço para tirar dúvidas, ajustar práticas e apoiar a implementação das orientações no cotidiano." },
];

const impacto = [
  { src: "/__l5e/assets-v1/01513a11-ba0b-4f48-a18f-651548cc4a0d/premiacao-projeto-tremembe.jpg", alt: "Luciane Molina segura certificado Ações Inclusivas.", caption: "Reconhecimento pelo projeto realizado em Tremembé." },
  { src: "/__l5e/assets-v1/fffdf31f-eb58-447a-83c3-aadd77400687/lancamento-livro-pocos-de-caldas-capitulo.jpg", alt: "Luciane Molina ao lado de banner laranja do lançamento do livro.", caption: "Lançamento de livro com capítulo de sua autoria." },
  { src: "/__l5e/assets-v1/a0a53beb-bd08-4b3e-b4c5-af943f6b5d65/apresentacao-tcc-banner-braille-unesp-zoomout.jpg", alt: "Luciane Molina lê texto em Braille em banner acessível.", caption: "Pesquisa acadêmica apresentada em banner acessível.", objectPos: "object-[center_30%]" },
  { src: "https://ftoenhzwgfyhtecowrkd.supabase.co/storage/v1/object/public/book-images/luciane-lendo-placa-braille-na-praca-sensorial.jpg", alt: "Luciane Molina toca uma placa em Braille em praça sensorial.", caption: "Braille também ocupa os espaços públicos.", objectPos: "object-[center_30%]" },
];

const artigos = [
  { titulo: "Abordagem Construcionista, Contextualizada e Significativa", sub: "Processos formativos de educadores para aprendizagem lúdica e inclusiva.", veiculo: "Pimenta Cultural · 2026", link: "https://doi.org/10.31560/pimentacultural/978-85-7221-628-9" },
  { titulo: "A importância do Sistema Braille para a autonomia e independência da pessoa cega", sub: "Pela visão dos dedos: o Braille, o sentido e o pertencimento na sociedade.", veiculo: "Instituto Benjamin Constant, GPESBRA · 2025", link: "https://www.gov.br/ibc/pt-br/pesquisa-e-tecnologia/publicacoes-do-ibc-1/livros_pdf/anexos/a-importancia-do-sistema-braille-para-a-autonomia-da-pessoa-cega_livro_2025.pdf" },
  { titulo: "Formação on-line de educadores de instituições especializadas em deficiência visual", sub: "Programa Braille Bricks Brasil.", veiculo: "Research, Society and Development · 2022", link: "https://rsdjournal.org/rsd/article/download/31321/26705/355888" },
  { titulo: "Braille e suas peculiaridades no ensino das pessoas com deficiência visual", sub: "", veiculo: "Revista Educação em Foco · 2022", link: "https://repositorio.usp.br/item/003124917" },
  { titulo: "Teorias da Aprendizagem: Deficiência Visual", sub: "", veiculo: "Universidade Federal do ABC, CAPES, UAB · 2022", link: "https://servidor-conteudo.ufabc.edu.br/arquivos/2023071131ae2a2614646973900b3763e/Deficiencia_visual_.pdf" },
  { titulo: "Ao Vivo e a Cores", sub: "Relatos de casos de audiodescrição de eventos ao vivo.", veiculo: "Amazon · 2021", link: "https://www.amazon.com.br/Ao-Vivo-Cores-relatos-audiodescri%C3%A7%C3%A3o-ebook/dp/B094R95MBM" },
  { titulo: "O Sistema Braille e a formação do professor", sub: "O acesso à leitura e à escrita por pessoas cegas.", veiculo: "Revista do Núcleo de Educação a Distância da UNESP · 2019", link: "https://ojs2.ead.unesp.br/index.php/cdep3/article/view/InFor4603v5n12019" },
  { titulo: "As placas de sinalização em Braille na escola inclusiva", sub: "Construindo espaços acessíveis na perspectiva da sustentabilidade.", veiculo: "Repositório Aberto, UAB · 2018", link: "https://1drv.ms/b/c/7d566d1cf1d9e85b/IQBYVn-3FIddSY9AHjoGTdRGATKOWQKJPv4g9zLNyTluNAw?e=fiqKV8" },
];

const premios = [
  { titulo: "Líderes de Acessibilidade", sub: "Categoria Profissionais de Acessibilidade.", veiculo: "Hand Talk · 2024", link: "" },
  { titulo: "Experiência Sensorial da nova logo do Itaú", sub: "", veiculo: "Design for a Better World · 2024", link: "https://dfbwaward.com/premiado/logo-tatil-em-fachada-acessivel-itau-lab/" },
  { titulo: "Menção Honrosa à profissional da inclusão e acessibilidade", sub: "", veiculo: "Academia Internacional da União Cultural · 2020", link: "" },
  { titulo: "Consultora em audiodescrição do curta Aluga-se um Destino", sub: "", veiculo: "V Festival VerOuvindo, Júri Popular · 2019", link: "" },
  { titulo: "IV Ações Inclusivas", sub: "", veiculo: "Secretaria de Estado da Pessoa com Deficiência de São Paulo · 2013", link: "" },
  { titulo: "IV Prêmio Sentidos", sub: "", veiculo: "Revista Sentidos e SEDPcD · 2011", link: "https://salaimprensa.com.br/imprensa/4o-premio-sentidos-homenageia-historias-de-superacao-de-pessoas-com-deficiencia/" },
];

const lives = [
  { titulo: "Braille e inclusão na prática com especialista e histórias reais", sub: "", veiculo: "TV Aparecida · 2026", link: "https://www.youtube.com/watch?v=ttFtbiOB9sQ" },
  { titulo: "Ponto de vista na Rádio Frei Galvão", sub: "Dia Mundial do Braille.", veiculo: "Rádio Frei Galvão · 2026", link: "https://www.youtube.com/watch?v=9CnR7oph3Ic&t=3s" },
  { titulo: "PCD em Foco #07 com Luciane Molina Barbosa", sub: "", veiculo: "TV SISEMUG · 2025", link: "https://www.youtube.com/live/HCXbFtzeyxg" },
  { titulo: "Alfabetização de alunos cegos", sub: "", veiculo: "Conexão Futura, TV Futura · 2021", link: "https://www.youtube.com/watch?v=IahoQPzgM8w" },
  { titulo: "Destaque Dia dos Professores", sub: "", veiculo: "Link Vanguarda, G1 Vanguarda · 2017", link: "https://globoplay.globo.com/v/8003973/" },
  { titulo: "Alunos e professores aprendem Libras e Braille em Tremembé", sub: "", veiculo: "G1 Vanguarda · 2014", link: "https://globoplay.globo.com/v/3543441/" },
];

const entrevistas = [
  { titulo: "Como a inteligência artificial tem ampliado a autonomia de pessoas com deficiência no digital", sub: "", veiculo: "Web para Todos, Spiral Interativa · 2026", link: "https://mwpt.com.br/como-a-inteligencia-artificial-tem-ampliado-a-autonomia-de-pessoas-com-deficiencia-no-digital/" },
  { titulo: "A importância de uma internet com acessibilidade e inclusão", sub: "", veiculo: "Vida Simples · 2024", link: "https://vidasimples.co/ouvindo-vida-simples/a-importancia-de-uma-internet-com-acessibilidade-e-inclusao/" },
  { titulo: "Braille e espaços públicos: onde o sistema ainda faz falta?", sub: "", veiculo: "Instituto Claro · 2021", link: "https://www.institutoclaro.org.br/cidadania/nossas-novidades/reportagens/braille-e-espacos-publicos-onde-o-sistema-ainda-faz-falta/" },
  { titulo: "Luta das pessoas com deficiência: audiodescrição significa “os olhos emprestados”", sub: "", veiculo: "Jornal de Brasília · 2020", link: "https://jornaldebrasilia.com.br/brasilia/luta-das-pessoas-com-deficiencia-audiodescricao-significa-os-olhos-emprestados/" },
  { titulo: "Professora cega atua para trazer mais inclusão à educação", sub: "", veiculo: "Universidade de Taubaté, UNITAU · 2019", link: "https://unitau.br/noticias/detalhes/2528/professora-cega-atua-para-trazer-mais-inclusao-a-educacao/" },
  { titulo: "“Escrevi a primeira carta em 15 anos graças à professora”, diz internauta", sub: "", veiculo: "G1 · 2013", link: "https://g1.globo.com/vc-no-g1/noticia/2013/10/escrevi-primeira-carta-em-15-anos-gracas-professora-diz-internauta.html" },
];

const depoimentos = [
  { nome: "Depoimento de Eliane", foto: "https://braillu.com.br/img/depoimentos/depoimento-eliane.jpeg", quem: "Professora do Centro de Apoio ao Deficiente Visual, CADV · Mossoró, RN", texto: ["Ser aluna de Luciane Molina, em 2021, no Curso de Braille, foi muito gratificante para minha vida profissional. As aulas on-line foram muito dinâmicas e produtivas. A metodologia utilizada e o material disponibilizado ajudaram-me, sobremaneira, a ressignificar minha prática pedagógica no ensino do Sistema Braille."] },
  { nome: "Depoimento de Denyse Guedes", foto: "https://braillu.com.br/img/depoimentos/depoimento-denyse-guedes.jpeg", quem: "Assistente social, advogada e professora universitária · Santos, SP", texto: ["Quero registrar minha alegria e satisfação por ter sido alfabetizada em Braille pela professora Luciane Molina. Mesmo não sendo professora da educação básica, sempre tive interesse em conhecer esse alfabeto, e a professora, com sua didática maravilhosa, criativa e por vezes divertida, ensinou o que eu achava impossível: o conhecimento das combinações dos pontos.", "Foi uma emoção muito grande. Cabe ressaltar o método mnemônico que ela usou para ensinar várias letras. Suas aulas foram maravilhosas e serão inesquecíveis. Em todos os lugares que encontro textos em Braille, procuro verificar o que ali está escrito."] },
  { nome: "Depoimento de Gisele Teixeira", foto: "https://braillu.com.br/img/depoimentos/depoimento-gisele-mae-ana.jpeg", quem: "Enfermeira e mãe da Ana · São José dos Campos, SP", texto: ["A professora Luciane foi uma pessoa muito especial em um dos momentos mais difíceis das nossas vidas, quando a Ana perdeu a visão na infância. Tenho uma gratidão enorme por tudo o que ela fez por nós. Deus concedeu a ela um dom maravilhoso de ensinar, acolher e transformar vidas através da inclusão e do amor ao próximo.", "Vejo a professora Luciane como uma grande referência no Braille e na educação inclusiva. Sua dedicação, paciência e profissionalismo fizeram toda a diferença em nossa caminhada. Sua formação e experiência refletem não apenas conhecimento, mas também humanidade e compromisso com cada aluno. Somos eternamente gratos por todo cuidado, apoio e ensinamentos que ela nos proporcionou."] },
  { nome: "Depoimento de Gisely Mafra", foto: "https://braillu.com.br/img/depoimentos/depoimento-gisely.jpeg", quem: "Pedagoga, pessoa com cegueira · Cachoeira Paulista, SP", texto: ["Fui aluna da professora Luciane Molina e me desenvolvi muito no aprendizado do Braille. Com o tempo tomei gosto pela área, me apaixonando pela profissão e me formando pedagoga. Em 2013 fiz o curso presencial de formação de professores em Grafia Braille da Luciane, para me qualificar ainda mais.", "Esse curso foi fundamental para enriquecer minha bagagem e abrir novas portas na carreira de professora. Hoje eu trabalho com muita dedicação ensinando e transformando a vida de pessoas com deficiência visual."] },
  { nome: "Depoimento de Josiane Lima", foto: "https://braillu.com.br/img/depoimentos/depoimento-josi.jpeg", quem: "Professora · Caraguatatuba, SP", texto: ["Tive o privilégio de participar de uma mentoria em Braille com a professora Luciane Molina. Com muito carinho, paciência e dedicação, ela compartilhou ensinamentos que marcaram minha caminhada e fizeram toda diferença no meu aprendizado.", "Aprendi não apenas sobre o Sistema Braille, mas também sobre sensibilidade, inclusão e a importância de olhar cada criança com amor e respeito às suas necessidades. Tudo o que ela ensinou foi muito significativo e foi utilizado para auxiliar uma criança com deficiência visual de maneira mais humana, acolhedora e eficiente.", "Sou muito grata por cada orientação, incentivo e cuidado. Sua mentoria deixou marcas lindas no meu coração e também na vida da criança que pôde ser alcançada através desse aprendizado."] },
];

function Figura({ src, alt, caption, objectPos = "object-top" }: { src: string; alt: string; caption: string; objectPos?: string }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <SafeImg src={src} alt={alt} loading="lazy" className={`aspect-[4/3] w-full object-cover ${objectPos}`} />
      <figcaption className="p-3 text-sm text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}

function LinkExterno({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80">
      {children} <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

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
    <div className="space-y-14">
      {/* Hero autoral */}
      <section
        aria-labelledby="autora-hero-title"
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-secondary/40 via-background to-accent/40 p-8 md:p-14 shadow-[var(--shadow-elegant)]"
      >
        <img
          src="/src/assets/logo-braillu-mais-circulo.png"
          alt="Logo da Braillu+, com identidade em roxo, amarelo e laranja, pontos em Braille e a mensagem Multiplicando Ações Inclusivas."
          className="relative z-10 mb-6 h-40 w-auto md:h-48"
        />
        <div className="relative z-10 max-w-3xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Braillu+, Multiplicando ações inclusivas
          </p>
          <h1 id="autora-hero-title" className="text-3xl font-bold leading-tight tracking-tight text-primary md:text-5xl">
            Mentoria educacional e curso em Sistema Braille, tecnologia assistiva e acessibilidade para educação e EAD
          </h1>
          <p className="mt-4 text-lg text-foreground/90 md:text-xl">
            Apoio escolas, universidades, professores e produtores de cursos a eliminarem barreiras que impedem estudantes com deficiência visual de aprender com autonomia, qualidade e dignidade.
          </p>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            A maioria dos cursos e materiais educacionais ainda nasce com barreiras invisíveis para quem não enxerga. Eu trabalho para que Braille, tecnologia assistiva e acessibilidade façam parte do planejamento pedagógico desde o início, garantindo que estudantes com deficiência visual possam aprender com autonomia, participação e equidade, da educação básica ao ensino superior.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={WA_TORNAR_ACESSIVEL} target="_blank" rel="noreferrer">
                <MessageCircle /> Quero tornar minha prática acessível
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#servicos">Conhecer os serviços <ArrowRight /></a>
            </Button>
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
      </section>

      {/* Lançamento curso */}
      <section aria-labelledby="lancamento-title" className="rounded-3xl border border-border bg-gradient-to-br from-accent/30 via-background to-primary/10 p-8 md:p-12">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Em breve</p>
        <h2 id="lancamento-title" className="text-2xl font-bold text-primary md:text-3xl">Lançamento do curso Braille Descomplicado</h2>
        <p className="mt-2 text-lg font-medium text-foreground/90">Semeando Leitores e Escritores Competentes</p>
        <p className="mt-3 text-base text-muted-foreground">Aguardem.</p>
      </section>

      {/* O problema que quase ninguém enxerga */}
      <section aria-labelledby="problema-title">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">O problema que quase ninguém enxerga</p>
        <h2 id="problema-title" className="mt-2 text-2xl font-bold text-primary md:text-3xl">O Braille precisa estar no centro das decisões pedagógicas</h2>
        <div className="mt-4 space-y-3 text-base leading-relaxed text-foreground/90 md:text-lg">
          <p>Em muitos contextos educacionais, o Braille ainda é deixado para depois. Cursos, materiais e práticas pedagógicas são planejados sem que ele faça parte das decisões desde o início.</p>
          <p>Ao mesmo tempo, o Braille vem sendo substituído por promessas de soluções tecnológicas rápidas, como se ouvir fosse equivalente a ler e escrever.</p>
          <p>Quando o professor conhece Braille, algo muito especial acontece na sala de aula. Ele passa a reconhecer a presença do estudante cego, suas formas próprias de ler, escrever, organizar o pensamento e participar das atividades.</p>
          <p>O Braille é a porta de entrada da criança cega para a alfabetização.</p>
          <p>É nesse ponto que meu trabalho atua: recolocando o Braille no centro das decisões pedagógicas e articulando seu uso com a tecnologia assistiva e os materiais didáticos, desde o início do processo educativo.</p>
        </div>
        <div className="mt-6">
          <Button asChild size="lg">
            <a href={WA_ORIENTACAO_PRATICA} target="_blank" rel="noreferrer">
              <MessageCircle /> Quero orientação sobre Braille na minha prática pedagógica
            </a>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Figura src="https://ftoenhzwgfyhtecowrkd.supabase.co/storage/v1/object/public/book-images/curso-ensinando-escrita-na-reglete.jpg" alt="Mãos utilizam punção e reglete metálica sobre folha presa em prancha para escrever em Braille." caption="Escrita em Braille com reglete e punção." />
          <Figura src="/maquina-perkins-crop.jpg" alt="Máquina Perkins Brailler em metal cinza sobre fundo branco, com teclas pretas e placa do fabricante." caption="Máquina Perkins para produção de textos em Braille." />
          <Figura src="https://ftoenhzwgfyhtecowrkd.supabase.co/storage/v1/object/public/book-images/livro-ibc.jpg?v=2" alt="Livros do título A importância do Sistema Braille para a autonomia e independência da pessoa cega, em versões impressa e em Braille." caption="Publicação apresentada em versão impressa e em Braille." />
        </div>
      </section>

      {/* Recursos concretos */}
      <section aria-labelledby="recursos-title">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Braille em materiais, práticas e espaços</p>
        <h2 id="recursos-title" className="mt-2 text-2xl font-bold text-primary md:text-3xl">Recursos concretos para ensinar, aprender e reconhecer o Braille</h2>
        <p className="mt-3 text-base leading-relaxed text-foreground/90 md:text-lg">
          O Sistema Braille se fortalece quando está presente nas práticas pedagógicas, nos materiais de alfabetização, nas experiências lúdicas e também nos espaços públicos. Esses recursos ampliam possibilidades de ensino, leitura, escrita e participação.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {recursos.map((r) => <Figura key={r.src} {...r} />)}
        </div>
      </section>

      {/* Sobre a autora */}
      <section aria-labelledby="sobre-title" className="grid gap-8 md:grid-cols-[280px_1fr] md:items-start">
        <figure className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <SafeImg src={CLOUD_FOTO_AUTORA} alt="Luciane Molina sorrindo ao lado de painel do Memorial da Inclusão." loading="lazy" className="aspect-square w-full object-cover" />
          <figcaption className="p-3 text-sm text-muted-foreground">Luciane Molina.</figcaption>
        </figure>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Quem conduz esse trabalho</p>
          <h2 id="sobre-title" className="mt-2 text-2xl font-bold text-primary md:text-3xl">Luciane Molina</h2>
          <p className="mt-2 text-base font-medium text-foreground/80 md:text-lg">Doutora e Mestra em Educação · Mentora em Braille, tecnologia assistiva e acessibilidade educacional</p>
          <p className="mt-4 text-base leading-relaxed text-foreground/90 md:text-lg">Meu trabalho nasce do encontro entre vivência, pesquisa e prática pedagógica.</p>
          <p className="mt-3 text-base leading-relaxed text-foreground/90 md:text-lg">Sou uma pessoa com deficiência visual e atuo com Sistema Braille, tecnologia assistiva, audiodescrição e acessibilidade educacional a partir de uma experiência concreta com a cegueira e de uma trajetória dedicada à formação de professores, à análise de materiais didáticos e à curadoria de acessibilidade para educação presencial e a distância.</p>
          <p className="mt-3 text-base leading-relaxed text-foreground/90 md:text-lg">Ao longo dos anos, acompanhei de perto as dificuldades de escolas, universidades e educadores que desejam incluir, mas não encontram orientação específica sobre como ensinar Braille, como articular seu uso com a tecnologia assistiva e como produzir materiais realmente utilizáveis por estudantes cegos.</p>
          <p className="mt-3 text-base leading-relaxed text-foreground/90 md:text-lg">Essa atuação é sustentada por produção acadêmica, participação em pesquisas, publicações, formações e projetos voltados à educação inclusiva e à acessibilidade para pessoas com deficiência visual.</p>
          <div className="mt-4">
            <LinkExterno href={LATTES_URL}>Ver currículo completo no Lattes</LinkExterno>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" aria-labelledby="servicos-title">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Como posso apoiar você</p>
        <h2 id="servicos-title" className="mt-2 text-2xl font-bold text-primary md:text-3xl">Soluções para educadores, famílias, profissionais e instituições</h2>
        <p className="mt-3 text-base leading-relaxed text-foreground/90 md:text-lg">
          Atendo educadores, familiares, profissionais e instituições que precisam de orientação segura sobre Sistema Braille, tecnologia assistiva e acessibilidade para estudantes com deficiência visual. Neste momento, ofereço de forma estruturada o curso de Braille, a mentoria educacional individual e a consultoria e análise de materiais.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {servicos.map((s) => (
            <article key={s.n} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <p className="text-sm font-bold text-primary/70">{s.n}</p>
              <h3 className="mt-1 text-xl font-bold text-primary">{s.titulo}</h3>
              {s.sub && <p className="mt-1 text-sm font-medium text-foreground/80">{s.sub}</p>}
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">{s.texto}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {galeriaServicos.map((g) => <Figura key={g.src} {...g} />)}
        </div>
        <div className="mt-6">
          <Button asChild size="lg">
            <a href={WA_CURSO_MENTORIA} target="_blank" rel="noreferrer">
              <MessageCircle /> Quero informações sobre o curso de Braille e a mentoria
            </a>
          </Button>
        </div>
      </section>

      {/* Trajetória */}
      <section aria-labelledby="trajetoria-title">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Formação, pesquisa e prática</p>
        <h2 id="trajetoria-title" className="mt-2 text-2xl font-bold text-primary md:text-3xl">Uma atuação construída no ensino, na investigação e no contato direto com pessoas e instituições</h2>
        <p className="mt-3 text-base leading-relaxed text-foreground/90 md:text-lg">
          A experiência de Luciane Molina atravessa salas de aula, cursos de formação, pesquisas acadêmicas, atividades práticas e espaços de memória e acessibilidade. Cada imagem revela uma parte desse trabalho contínuo em favor do Braille e da inclusão.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {trajetoria.map((t) => <Figura key={t.src} {...t} />)}
        </div>
      </section>

      {/* Como funciona o acompanhamento */}
      <section aria-labelledby="acompanhamento-title">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Como funciona o acompanhamento</p>
        <h2 id="acompanhamento-title" className="mt-2 text-2xl font-bold text-primary md:text-3xl">Escuta, análise e orientação aplicável à prática</h2>
        <p className="mt-3 text-base leading-relaxed text-foreground/90 md:text-lg">
          Cada escola, profissional ou família chega com uma realidade diferente. Por isso, o trabalho começa sempre pela escuta e pela compreensão do contexto em que a pessoa com deficiência visual está inserida.
        </p>
        <ol className="mt-6 grid gap-4 md:grid-cols-2">
          {passos.map((p) => (
            <li key={p.n} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">{p.n}</div>
              <h3 className="mt-3 text-lg font-bold text-primary">{p.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">{p.texto}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-base leading-relaxed text-foreground/90 md:text-lg">
          Esse processo garante que as decisões não sejam baseadas em tentativa e erro, mas em conhecimento específico sobre Braille, deficiência visual e educação.
        </p>
        <div className="mt-6">
          <Button asChild size="lg">
            <a href={WA_INICIAR_MENTORIA} target="_blank" rel="noreferrer">
              <MessageCircle /> Quero iniciar a mentoria em Braille
            </a>
          </Button>
        </div>
      </section>

      {/* Impacto */}
      <section aria-labelledby="impacto-title">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Impacto e presença pública</p>
        <h2 id="impacto-title" className="mt-2 text-2xl font-bold text-primary md:text-3xl">Pesquisa, reconhecimento e participação ativa na educação inclusiva</h2>
        <p className="mt-3 text-base leading-relaxed text-foreground/90 md:text-lg">
          Uma trajetória construída entre formação, pesquisa, produção de conhecimento, acessibilidade e presença em iniciativas que ampliam o reconhecimento do Braille e da educação inclusiva.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {impacto.map((i) => <Figura key={i.src} {...i} />)}
        </div>
      </section>

      {/* Produção acadêmica */}
      <section aria-labelledby="producao-title">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Produção acadêmica, reconhecimentos e participação pública</p>
        <h2 id="producao-title" className="mt-2 text-2xl font-bold text-primary md:text-3xl">Conhecimento construído em publicações, prêmios e presença no debate público</h2>
        <p className="mt-3 text-base leading-relaxed text-foreground/90 md:text-lg">
          Minha atuação em Sistema Braille, tecnologia assistiva e acessibilidade educacional é sustentada por pesquisa, produção acadêmica e participação ativa em espaços de formação, debate e divulgação de conhecimento.
        </p>

        <h3 className="mt-8 text-xl font-bold text-primary">Artigos e capítulos publicados</h3>
        <ul className="mt-4 space-y-4">
          {artigos.map((a) => (
            <li key={a.titulo} className="rounded-xl border border-border bg-card p-4">
              <h4 className="font-bold text-foreground">{a.titulo}</h4>
              {a.sub && <p className="mt-1 text-sm text-foreground/80">{a.sub}</p>}
              <p className="mt-1 text-xs text-muted-foreground">{a.veiculo}</p>
              {a.link && <div className="mt-2"><LinkExterno href={a.link}>Ler publicação</LinkExterno></div>}
            </li>
          ))}
        </ul>

        <h3 className="mt-8 text-xl font-bold text-primary">Premiações e reconhecimentos</h3>
        <figure className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <SafeImg src="https://braillu.com.br/img/premios/montagem-premios-luciane-molina.jpg" alt="Montagem com fotos, certificados e troféus de premiações recebidas por Luciane Molina." loading="lazy" className="w-full object-cover" />
          <figcaption className="p-3 text-sm text-muted-foreground">Reconhecimentos recebidos por Luciane Molina em acessibilidade, educação inclusiva e valorização do Sistema Braille.</figcaption>
        </figure>
        <ul className="mt-4 space-y-4">
          {premios.map((a) => (
            <li key={a.titulo} className="rounded-xl border border-border bg-card p-4">
              <h4 className="font-bold text-foreground">{a.titulo}</h4>
              {a.sub && <p className="mt-1 text-sm text-foreground/80">{a.sub}</p>}
              <p className="mt-1 text-xs text-muted-foreground">{a.veiculo}</p>
              {a.link && <div className="mt-2"><LinkExterno href={a.link}>Ler publicação</LinkExterno></div>}
            </li>
          ))}
        </ul>

        <h3 className="mt-8 text-xl font-bold text-primary">Lives, vídeos e participações</h3>
        <ul className="mt-4 space-y-4">
          {lives.map((a) => (
            <li key={a.titulo} className="rounded-xl border border-border bg-card p-4">
              <h4 className="font-bold text-foreground">{a.titulo}</h4>
              {a.sub && <p className="mt-1 text-sm text-foreground/80">{a.sub}</p>}
              <p className="mt-1 text-xs text-muted-foreground">{a.veiculo}</p>
              {a.link && <div className="mt-2"><LinkExterno href={a.link}>Assistir à participação</LinkExterno></div>}
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <LinkExterno href="https://www.youtube.com/channel/UCxuvTg5gqFBK8_zXAV91TLw">Acessar meu canal no YouTube</LinkExterno>
        </div>

        <h3 className="mt-8 text-xl font-bold text-primary">Entrevistas e matérias</h3>
        <ul className="mt-4 space-y-4">
          {entrevistas.map((a) => (
            <li key={a.titulo} className="rounded-xl border border-border bg-card p-4">
              <h4 className="font-bold text-foreground">{a.titulo}</h4>
              {a.sub && <p className="mt-1 text-sm text-foreground/80">{a.sub}</p>}
              <p className="mt-1 text-xs text-muted-foreground">{a.veiculo}</p>
              {a.link && <div className="mt-2"><LinkExterno href={a.link}>Ler publicação</LinkExterno></div>}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-4">
          <LinkExterno href="https://profalumolina.wixsite.com/lumolina">Ver produção completa</LinkExterno>
          <LinkExterno href={LATTES_URL}>Acessar meu currículo Lattes</LinkExterno>
        </div>
      </section>

      {/* Depoimentos */}
      <section aria-labelledby="depoimentos-title">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Depoimentos</p>
        <h2 id="depoimentos-title" className="mt-2 text-2xl font-bold text-primary md:text-3xl">A experiência de quem já foi orientado</h2>
        <p className="mt-3 text-base leading-relaxed text-foreground/90 md:text-lg">
          A experiência de quem já participou da mentoria e do curso de Braille mostra, na prática, como a orientação transforma o trabalho pedagógico e a segurança de professores, famílias e instituições.
        </p>
        <Carousel
          opts={{ align: "start", loop: true }}
          className="mt-6 w-full"
        >
          <CarouselContent className="-ml-4">
            {depoimentos.map((d) => (
              <CarouselItem key={d.nome} className="pl-4 basis-full md:basis-1/2">
                <article className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] h-full">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                        {d.nome.replace("Depoimento de ", "").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold text-primary">{d.nome}</h3>
                      <p className="text-xs text-muted-foreground">{d.quem}</p>
                    </div>
                  </div>
                  <blockquote className="mt-4 space-y-3 border-l-4 border-primary/40 pl-4 text-sm italic leading-relaxed text-foreground/90">
                    {d.texto.map((p, i) => <p key={i}>{p}</p>)}
                  </blockquote>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-4 flex justify-center gap-2">
            <CarouselPrevious className="static translate-x-0 translate-y-0" />
            <CarouselNext className="static translate-x-0 translate-y-0" />
          </div>
        </Carousel>
      </section>

      {/* Próximo passo */}
      <section aria-labelledby="proximo-title" className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-accent/30 p-8 md:p-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Próximo passo</p>
          <h2 id="proximo-title" className="mt-2 text-2xl font-bold text-primary md:text-3xl">Está na hora de transformar intenção inclusiva em prática acessível</h2>
          <p className="mt-3 text-base text-foreground/90 md:text-lg">
            Se você chegou até aqui, provavelmente também sente que precisa de orientação segura sobre o ensino do Braille, o uso da tecnologia assistiva e a organização de práticas realmente acessíveis para estudantes com deficiência visual. Estou pronta para apoiar você nesse processo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={WA_INICIAR_MENTORIA} target="_blank" rel="noreferrer">
                <MessageCircle /> Quero iniciar a mentoria em Braille
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={WA_CURSO_MENTORIA} target="_blank" rel="noreferrer">
                Quero informações sobre o curso de Braille
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Autora;
