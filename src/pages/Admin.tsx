import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersPanel } from "@/components/admin/UsersPanel";
import { MaterialsPanel } from "@/components/admin/MaterialsPanel";

export default function Admin() {
  const { isAdmin, loading } = useAuth();

  if (loading) return <p className="py-10 text-center text-muted-foreground">Carregando...</p>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="py-6">
      <h1 className="mb-2 text-3xl font-bold text-primary">Área administrativa</h1>
      <p className="mb-6 text-muted-foreground">
        Gerencie cadastros, aprove leitores, entre em contato e compartilhe materiais.
      </p>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Cadastros</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="pt-6">
          <UsersPanel />
        </TabsContent>

        <TabsContent value="materials" className="pt-6">
          <MaterialsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}