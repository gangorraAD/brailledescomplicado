import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function PendingApproval() {
  const { profile, signOut, refreshProfile } = useAuth();
  return (
    <div className="mx-auto max-w-xl py-12 text-center">
      <h1 className="mb-4 text-3xl font-bold text-primary">Aguardando aprovação</h1>
      <p className="mb-2 text-foreground">
        Olá{profile?.name ? `, ${profile.name}` : ""}! Seu cadastro foi recebido.
      </p>
      <p className="mb-6 text-muted-foreground">
        O administrador precisa aprovar seu acesso antes que você possa ler o livro.
        Você receberá acesso assim que isso for feito.
      </p>
      <div className="flex justify-center gap-3">
        <Button onClick={refreshProfile} variant="outline">Verificar novamente</Button>
        <Button onClick={signOut} variant="ghost">Sair</Button>
      </div>
    </div>
  );
}