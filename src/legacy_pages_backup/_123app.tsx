import "../styles/globals.css"; // Tailwind and global styles
import type { AppProps } from "next/app";
import { AuthProvider } from "../contexts/AuthContext";
import { Navbar } from "../components/layout/Navbar";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
