import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Kind = "documento" | "atividade" | "imagem" | "audio" | "video" | "outro";

type Material = {
  id: string;
  title: string;
  description: string | null;
  kind: Kind;
  file_path: string;
  file_name: string;
  file_size: number;
  is_public: boolean;
  recipient_id: string | null;
  created_at: string;
};

const KIND_LABELS: Record<Kind, string> = {
  documento: "Documento",
  atividade: "Atividade",
  imagem: "Imagem",
  audio: "Áudio",
  video: "Vídeo",
  outro: "Outro",
};

function formatSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Materiais() {
  const [items, setItems] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          toast({ title: "Erro", description: error.message, variant: "destructive" });
        } else {
          setItems((data ?? []) as Material[]);
        }
        setLoading(false);
      });
  }, []);

  const download = async (m: Material) => {
    const { data, error } = await supabase.storage
      .from("materials")
      .createSignedUrl(m.file_path, 60 * 10);
    if (error || !data) {
      toast({ title: "Erro ao baixar", description: error?.message, variant: "destructive" });
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  const publics = items.filter((i) => i.is_public);
  const mine = items.filter((i) => !i.is_public);

  return (
    <div className="py-6">
      <h1 className="mb-2 text-3xl font-bold text-primary">Materiais</h1>
      <p className="mb-8 text-muted-foreground">
        Documentos, atividades e mídias compartilhados pela autora.
      </p>

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : (
        <>
          {mine.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold">📩 Enviados para você</h2>
              <List items={mine} onDownload={download} />
            </section>
          )}

          <section>
            <h2 className="mb-3 text-xl font-semibold">📚 Biblioteca</h2>
            {publics.length ? (
              <List items={publics} onDownload={download} />
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum material disponível ainda.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function List({
  items,
  onDownload,
}: {
  items: Material[];
  onDownload: (m: Material) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((m) => (
        <Card key={m.id}>
          <CardContent className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate font-semibold">{m.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {m.file_name} · {formatSize(m.file_size)}
                </p>
              </div>
              <Badge variant="outline">{KIND_LABELS[m.kind]}</Badge>
            </div>
            {m.description && (
              <p className="text-sm text-muted-foreground">{m.description}</p>
            )}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">
                {new Date(m.created_at).toLocaleDateString("pt-BR")}
              </span>
              <Button size="sm" variant="outline" onClick={() => onDownload(m)}>
                <Download className="mr-1 h-4 w-4" />
                Baixar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}