import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Informe o nome").max(120),
  nickname: z.string().trim().min(1, "Informe o nickname").max(60),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
});

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Profile | null;
  onSaved: () => void;
};

async function callAdmin(body: Record<string, unknown>) {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  const { data, error } = await supabase.functions.invoke("admin-user-actions", {
    body,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (error) {
    const msg = (data as { error?: string } | null)?.error ?? error.message;
    throw new Error(msg);
  }
  if (data && (data as { error?: string }).error) {
    throw new Error((data as { error: string }).error);
  }
  return data;
}

export function EditUserDialog({ open, onOpenChange, user, onSaved }: Props) {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open && user) {
      setName(user.name ?? "");
      setNickname(user.nickname ?? "");
      setEmail(user.email ?? "");
      setPhone(user.phone ?? "");
      setNewPassword("");
    }
  }, [open, user]);

  const close = () => {
    setName("");
    setNickname("");
    setEmail("");
    setPhone("");
    setNewPassword("");
    onOpenChange(false);
  };

  const save = async () => {
    if (!user) return;
    const parsed = schema.safeParse({ name, nickname, email, phone });
    if (!parsed.success) {
      toast({
        title: "Dados inválidos",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    try {
      await callAdmin({
        action: "update_profile",
        user_id: user.id,
        name: parsed.data.name,
        nickname: parsed.data.nickname,
        email: parsed.data.email,
        phone: parsed.data.phone ?? "",
      });
      toast({ title: "Dados atualizados" });
      onSaved();
      close();
    } catch (e) {
      toast({ title: "Erro", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const sendReset = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await callAdmin({
        action: "send_password_reset",
        user_id: user.id,
        redirect_to: `${window.location.origin}/reset-password`,
      });
      toast({
        title: "Email enviado",
        description: "O usuário receberá um link para redefinir a senha.",
      });
    } catch (e) {
      toast({ title: "Erro", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const setPassword = async () => {
    if (!user) return;
    if (newPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "Use ao menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    try {
      await callAdmin({
        action: "set_password",
        user_id: user.id,
        password: newPassword,
      });
      toast({ title: "Senha redefinida" });
      setNewPassword("");
    } catch (e) {
      toast({ title: "Erro", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) close();
        else onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar usuário</DialogTitle>
          <DialogDescription>
            Atualize os dados de contato ou redefina a senha do usuário.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="edit-name">Nome</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="edit-nick">Nickname</Label>
            <Input
              id="edit-nick"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-phone">WhatsApp / telefone</Label>
            <Input
              id="edit-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: 11999999999"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={close} disabled={busy}>
            Cancelar
          </Button>
          <Button onClick={save} disabled={busy}>
            Salvar alterações
          </Button>
        </DialogFooter>

        <div className="mt-4 space-y-3 rounded-md border border-border p-3">
          <p className="text-sm font-medium">Redefinir senha</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={sendReset}
            disabled={busy}
            className="w-full"
          >
            Enviar email de redefinição
          </Button>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="edit-pw" className="text-xs">
                Definir nova senha manualmente
              </Label>
              <Input
                id="edit-pw"
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mín. 6 caracteres"
              />
            </div>
            <Button size="sm" onClick={setPassword} disabled={busy || newPassword.length < 6}>
              Aplicar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}