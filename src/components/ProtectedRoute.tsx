import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import PendingApproval from "@/pages/PendingApproval";

export function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { user, profile, isAdmin, loading } = useAuth();
  if (loading) {
    return <p className="py-10 text-center text-muted-foreground">Carregando...</p>;
  }
  if (!user) return <Navigate to={adminOnly ? "/auth" : "/cela"} replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  if (!isAdmin && !profile?.approved) return <PendingApproval />;
  return <>{children}</>;
}