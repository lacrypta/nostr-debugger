import type { Metadata } from "next";
import AppProvider from "@/context/AppProvider";
import "@lawallet/ui/styles";

export const metadata: Metadata = {
  title: "Nostr Debugger",
  description: "Nostr Debugger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
