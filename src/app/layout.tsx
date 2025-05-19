import "../styles/globals.css";
import { Providers } from "./providers";
import { Footer } from "../components/layout/Footer";

export const metadata = {
  title: "EasyLearn",
  description: "Learn faster with cards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col bg-gray-50 w-full">
            <main className="flex-grow pt-16 w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
