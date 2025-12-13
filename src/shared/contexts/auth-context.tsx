"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/src/shared/types/user';
import { currentUser } from '@/src/shared/services/data-store';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  hasRole: (roles: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_PERMISSIONS = {
  Admin: ['all'],
  Doctor: ['patients:read', 'patients:write', 'appointments:read', 'appointments:write', 'reports:read'],
  Staff: ['patients:read', 'appointments:read', 'appointments:write', 'leads:read', 'leads:write', 'tasks:read', 'tasks:write'],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch('/api/auth/user');
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user:', error);
        setUser(currentUser);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const hasRole = (roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    
    if (userPermissions.includes('all')) return true;
    
    return userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, hasRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

