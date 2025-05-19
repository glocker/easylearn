import "../styles/globals.css";
import { Providers } from "./providers";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
