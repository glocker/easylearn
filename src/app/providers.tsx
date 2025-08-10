"use client";

import { AuthProvider } from "@/shared/contexts/AuthContext";
import { Navbar } from "@/widgets/Navbar";
import { useEffect } from "react";
import { useAuthStore } from "@/entities/user/store";
import { getUserProfile } from "@/shared/utils/firebase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Load demo user by id
    getUserProfile("VDV7KI1fwQMqOuCr3pFy1IkjiUO2").then((demoUser) => {
      if (demoUser) setUser(demoUser);
    });
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Navbar />
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
