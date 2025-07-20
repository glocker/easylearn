"use client";

import { AuthProvider } from "@/shared/contexts/AuthContext";
import { Navbar } from "@/widgets/Navbar";
import { useEffect } from "react";
import { useAuthStore } from "@/entities/user/store";
import { getUserProfile } from "@/shared/utils/firebase";

export function Providers({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Load demo user by id
    getUserProfile("VDV7KI1fwQMqOuCr3pFy1IkjiUO2").then((demoUser) => {
      if (demoUser) setUser(demoUser);
    });
  }, [setUser]);

  return (
    <AuthProvider>
      <Navbar />
      {children}
    </AuthProvider>
  );
}
