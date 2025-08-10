"use client";

import { AuthProvider } from "@/shared/contexts/AuthContext";
import { Navbar } from "@/widgets/Navbar";
import { useEffect } from "react";
import { useAuthStore } from "@/entities/user/store";
import { getUserProfile } from "@/shared/utils/firebase";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "./get-query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
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
