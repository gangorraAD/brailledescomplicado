import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const signupSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  nickname: z.string().trim().min(2, "Mínimo 2 caracteres").max(40).regex(/^[a-zA-Z0-9_.-]+$/, "Use letras, números, _ . -"),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().min(8, "Informe um telefone válido").max(20).regex(/^[0-9+()\-\s]+$/, "Use apenas números e + ( ) -"),
  password: z.string().min(6, "Senha precisa de pelo menos 6 caracteres").max(72),
  confirmPassword: z.string().min(1, "Confirme sua senha"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().trim().email("Email inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotBusy, setForgotBusy] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signupSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast({ title: "Verifique os campos", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setBusy(true);
    const { name, nickname, email, phone, password } = parsed.data;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { name, nickname, phone },
      },
    });
    setBusy(false);
    if (error) {
      toast({ title: "Erro no cadastro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Cadastro enviado", description: "Aguarde a aprovação do administrador." });
    navigate("/");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = loginSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast({ title: "Verifique os campos", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setBusy(true);
    const { email, password } = parsed.data;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast({ title: "Não foi possível entrar", description: error.message, variant: "destructive" });
      return;
    }
    navigate("/");
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = forgotEmail.trim();
    if (!z.string().email().safeParse(email).success) {
      toast({ title: "Email inválido", description: "Informe um email válido.", variant: "destructive" });
      return;
    }
    setForgotBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setForgotBusy(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Email enviado", description: "Verifique sua caixa de entrada para redefinir a senha." });
    setForgotOpen(false);
    setForgotEmail("");
  };

  return (
    <div className="mx-auto max-w-md py-10">
      <h1 className="mb-6 text-3xl font-bold text-primary">Entre na oficina</h1>
      <p className="mb-6 text-muted-foreground">
        A <strong>Cela Interativa</strong> é gratuita e está liberada para todos. Cadastre-se ou
        entre para acessar o e-book completo, capítulos, vídeos, atividades e materiais da oficina.
        Novos cadastros precisam ser aprovados pelo administrador.
      </p>
      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Entrar</TabsTrigger>
          <TabsTrigger value="signup">Cadastrar</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form onSubmit={handleLogin} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Entrando..." : "Entrar"}
            </Button>
            <div className="text-center">
              <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="link" className="text-sm">
                    Esqueci a senha
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Redefinir senha</DialogTitle>
                    <DialogDescription>
                      Informe seu email e enviaremos um link para você criar uma nova senha.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email</Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        autoComplete="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={forgotBusy} className="w-full">
                        {forgotBusy ? "Enviando..." : "Enviar link de redefinição"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="signup">
          <form onSubmit={handleSignup} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname">Apelido (nickname)</Label>
              <Input id="nickname" name="nickname" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(11) 91234-5678" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" autoComplete="new-password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Repetir senha</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Enviando..." : "Cadastrar"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}