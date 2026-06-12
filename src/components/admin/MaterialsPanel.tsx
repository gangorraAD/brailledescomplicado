import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Download, Trash2, Upload } from "lucide-react";

type Kind = "documento" | "atividade" | "imagem" | "audio" | "video" | "outro";

type Material = {
  id: string;
  title: string;
  description: string | null;
  kind: Kind;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string | null;
  is_public: boolean;
  recipient_id: string | null;
  created_at: string;
};

type ProfileLite = { id: string; name: string; nickname: string; email: string; approved: boolean };

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

export function MaterialsPanel() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [users, setUsers] = useState<ProfileLite[]>([]);
  const [busy, setBusy] = useState(false);

  // form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState<Kind>("documento");
  const [target, setTarget] = useState<string>("public"); // "public" or user id
  const [file, setFile] = useState<File | null>(null);

  const load = async () => {
    const [{ data: mats }, { data: profs }] = await Promise.all([
      supabase.from("materials").select("*").order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("id,name,nickname,email,approved")
        .order("name", { ascending: true }),
    ]);
    setMaterials((mats ?? []) as Material[]);
    setUsers((profs ?? []) as ProfileLite[]);
  };

  useEffect(() => {
    load();
  }, []);

  const reset = () => {
    setTitle("");
    setDescription("");
    setKind("documento");
    setTarget("public");
    setFile(null);
    const input = document.getElementById("material-file") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim()) {
      toast({ title: "Informe um título", variant: "destructive" });
      return;
    }
    if (!file) {
      toast({ title: "Selecione um arquivo", variant: "destructive" });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "Arquivo muito grande", description: "Limite de 50 MB.", variant: "destructive" });
      return;
    }

    setBusy(true);
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${target === "public" ? "public" : `user/${target}`}/${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("materials")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) {
      setBusy(false);
      toast({ title: "Falha no upload", description: upErr.message, variant: "destructive" });
      return;
    }

    const { error: insErr } = await supabase.from("materials").insert({
      title: title.trim(),
      description: description.trim() || null,
      kind,
      file_path: path,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type || null,
      is_public: target === "public",
      recipient_id: target === "public" ? null : target,
      created_by: user.id,
    });

    if (insErr) {
      await supabase.storage.from("materials").remove([path]);
      setBusy(false);
      toast({ title: "Erro ao salvar", description: insErr.message, variant: "destructive" });
      return;
    }

    toast({ title: "Material enviado" });
    reset();
    await load();
    setBusy(false);
  };

  const download = async (m: Material) => {
    const { data, error } = await supabase.storage
      .from("materials")
      .createSignedUrl(m.file_path, 60 * 10);
    if (error || !data) {
      toast({ title: "Erro ao gerar link", description: error?.message, variant: "destructive" });
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  const remove = async (m: Material) => {
    if (!confirm(`Excluir "${m.title}"?`)) return;
    const { error } = await supabase.from("materials").delete().eq("id", m.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    await supabase.storage.from("materials").remove([m.file_path]);
    toast({ title: "Material removido" });
    load();
  };

  const userById = new Map(users.map((u) => [u.id, u]));
  const approvedUsers = users.filter((u) => u.approved);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Enviar novo material</CardTitle>
          <CardDescription>
            Compartilhe documentos, atividades, áudios ou vídeos com todos os leitores aprovados ou
            envie diretamente para um único usuário.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="m-title">Título *</Label>
              <Input
                id="m-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="m-desc">Descrição</Label>
              <Textarea
                id="m-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={kind} onValueChange={(v) => setKind(v as Kind)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(KIND_LABELS) as Kind[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {KIND_LABELS[k]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Destinatário</Label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">📚 Biblioteca pública (todos aprovados)</SelectItem>
                  {approvedUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      👤 {u.name} ({u.nickname})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="material-file">Arquivo * (até 50 MB)</Label>
              <Input
                id="material-file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={busy} className="gap-2">
                <Upload className="h-4 w-4" />
                {busy ? "Enviando..." : "Enviar material"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-3 text-xl font-semibold">
          Materiais enviados ({materials.length})
        </h2>
        {!materials.length ? (
          <p className="text-sm text-muted-foreground">Nenhum material ainda.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {materials.map((m) => {
              const recipient = m.recipient_id ? userById.get(m.recipient_id) : null;
              return (
                <Card key={m.id}>
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">{m.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {m.file_name} · {formatSize(m.file_size)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline">{KIND_LABELS[m.kind]}</Badge>
                        {m.is_public ? (
                          <Badge>Pública</Badge>
                        ) : (
                          <Badge variant="secondary">
                            Para: {recipient?.nickname ?? "usuário"}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {m.description && (
                      <p className="text-sm text-muted-foreground">{m.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(m.created_at).toLocaleDateString("pt-BR")}
                      </span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => download(m)}>
                          <Download className="mr-1 h-4 w-4" />
                          Baixar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => remove(m)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}