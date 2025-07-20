import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "@/shared/utils/firebase";

export function withAuth<P>(Component: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const router = useRouter();

    useEffect(() => {
      if (!auth.currentUser) {
        router.push("/auth/signin");
      }
    }, []);

    return <Component {...props} />;
  };
}
