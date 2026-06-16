import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, MessageCircle, Check, X, Trash2, Pencil } from "lucide-react";
import { EditUserDialog } from "./EditUserDialog";

type Row = Profile & { roles: string[] };

function waLink(phone: string) {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return null;
  const withDdi = digits.startsWith("55") || digits.length > 11 ? digits : `55${digits}`;
  return `https://wa.me/${withDdi}`;
}

export function UsersPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [editing, setEditing] = useState<Profile | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const load = async () => {
    setBusy(true);
    const { data: profs, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
      setBusy(false);
      return;
    }
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");
    const map = new Map<string, string[]>();
    (roles ?? []).forEach((r: { user_id: string; role: string }) => {
      const arr = map.get(r.user_id) ?? [];
      arr.push(r.role);
      map.set(r.user_id, arr);
    });
    setRows((profs ?? []).map((p) => ({ ...(p as Profile), roles: map.get(p.id) ?? [] })));
    setBusy(false);
  };

  useEffect(() => {
    load();
  }, []);

  const setApproved = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("profiles").update({ approved }).eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: approved ? "Usuário aprovado" : "Aprovação revogada" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Remover este usuário permanentemente?")) return;
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Usuário removido" });
    load();
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "pending" && r.approved) return false;
      if (filter === "approved" && !r.approved) return false;
      if (!term) return true;
      return (
        r.name.toLowerCase().includes(term) ||
        r.nickname.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        (r.phone ?? "").toLowerCase().includes(term)
      );
    });
  }, [rows, q, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Buscar por nome, nickname, email ou telefone"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-1">
          {(["all", "pending", "approved"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Todos" : f === "pending" ? "Pendentes" : "Aprovados"}
            </Button>
          ))}
        </div>
        <span className="ml-auto text-sm text-muted-foreground">
          {filtered.length} de {rows.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Nickname</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Papéis</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => {
              const wa = waLink(r.phone);
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.nickname}</TableCell>
                  <TableCell className="break-all">{r.email}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.phone || "—"}</TableCell>
                  <TableCell>
                    {r.approved ? (
                      <Badge>Aprovado</Badge>
                    ) : (
                      <Badge variant="secondary">Pendente</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">{r.roles.join(", ") || "—"}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs">
                    {new Date(r.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="space-x-1 whitespace-nowrap text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      title="Editar"
                      onClick={() => {
                        setEditing(r);
                        setEditOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button asChild size="icon" variant="ghost" title="Enviar email">
                      <a href={`mailto:${r.email}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                    {wa && (
                      <Button
                        size="icon"
                        variant="ghost"
                        title="WhatsApp"
                        onClick={() => window.open(wa, "_blank", "noopener,noreferrer")}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      title={r.approved ? "Revogar aprovação" : "Aprovar"}
                      onClick={() => setApproved(r.id, !r.approved)}
                    >
                      {r.approved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      title="Remover"
                      onClick={() => remove(r.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {!filtered.length && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-sm text-muted-foreground">
                  Nenhum usuário.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {busy && <p className="text-sm text-muted-foreground">Atualizando...</p>}
      <EditUserDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={editing}
        onSaved={load}
      />
    </div>
  );
}