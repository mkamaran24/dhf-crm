"use client";

import { ReactNode } from 'react';
import { useAuth } from '@/src/shared/contexts/auth-context';

interface ProtectedProps {
  children: ReactNode;
  roles?: string[];
  permissions?: string[];
  fallback?: ReactNode;
}

export function Protected({ children, roles, permissions, fallback = null }: ProtectedProps) {
  const { hasRole, hasPermission } = useAuth();

  if (roles && !hasRole(roles)) {
    return <>{fallback}</>;
  }

  if (permissions && !permissions.some(hasPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

