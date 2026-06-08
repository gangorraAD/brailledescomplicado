import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, Profile } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Row = Profile & { roles: string[] };

export default function Admin() {
  const { isAdmin, loading } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);

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
    if (isAdmin) load();
  }, [isAdmin]);

  if (loading) return <p className="py-10 text-center text-muted-foreground">Carregando...</p>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const setApproved = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("profiles").update({ approved }).eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: approved ? "Usuário aprovado" : "Aprovação removida" });
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

  const pending = rows.filter((r) => !r.approved);
  const approved = rows.filter((r) => r.approved);

  return (
    <div className="py-6">
      <h1 className="mb-2 text-3xl font-bold text-primary">Área administrativa</h1>
      <p className="mb-6 text-muted-foreground">Gerencie cadastros e aprovações dos usuários.</p>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Aguardando aprovação ({pending.length})</h2>
        <UserTable rows={pending} onApprove={(id) => setApproved(id, true)} onRemove={remove} action="approve" />
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Aprovados ({approved.length})</h2>
        <UserTable rows={approved} onApprove={(id) => setApproved(id, false)} onRemove={remove} action="revoke" />
      </section>

      {busy && <p className="mt-4 text-sm text-muted-foreground">Atualizando...</p>}
    </div>
  );
}

function UserTable({
  rows,
  onApprove,
  onRemove,
  action,
}: {
  rows: Row[];
  onApprove: (id: string) => void;
  onRemove: (id: string) => void;
  action: "approve" | "revoke";
}) {
  if (!rows.length) return <p className="text-sm text-muted-foreground">Nenhum usuário.</p>;
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Nickname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Papéis</TableHead>
            <TableHead>Cadastro</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.name}</TableCell>
              <TableCell>{r.nickname}</TableCell>
              <TableCell>{r.email}</TableCell>
              <TableCell>{r.roles.join(", ") || "—"}</TableCell>
              <TableCell>{new Date(r.created_at).toLocaleDateString("pt-BR")}</TableCell>
              <TableCell className="space-x-2 text-right">
                <Button size="sm" onClick={() => onApprove(r.id)}>
                  {action === "approve" ? "Aprovar" : "Revogar"}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onRemove(r.id)}>
                  Remover
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}