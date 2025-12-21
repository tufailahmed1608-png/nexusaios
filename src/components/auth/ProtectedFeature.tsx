import { ReactNode } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { AppRole } from '@/lib/permissions';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface ProtectedFeatureProps {
  children: ReactNode;
  feature?: string;
  minimumRole?: AppRole;
  fallback?: ReactNode;
  showAccessDenied?: boolean;
}

export function ProtectedFeature({
  children,
  feature,
  minimumRole,
  fallback,
  showAccessDenied = true,
}: ProtectedFeatureProps) {
  const { canAccess, hasMinRole, loading } = useUserRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const hasAccess = feature ? canAccess(feature) : minimumRole ? hasMinRole(minimumRole) : true;

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showAccessDenied) {
      return (
        <div className="flex items-center justify-center min-h-[300px] p-6">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center space-y-4">
              <ShieldAlert className="h-12 w-12 text-destructive mx-auto" />
              <h2 className="text-xl font-semibold">Access Restricted</h2>
              <p className="text-muted-foreground">
                You don't have permission to access this feature. Contact your administrator if you believe this is an error.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
}
