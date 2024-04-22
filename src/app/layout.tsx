import type { Metadata } from "next";
import "@lawallet/ui/styles";
import AppProvider from "@/context/AppProvider";

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
