"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { appTheme } from "@/config/theme";
import { NostrProvider, createConfig } from "@lawallet/react";
import { Container, Divider } from "@lawallet/ui";
import { NextProvider } from "@lawallet/ui/next";
import React, { Suspense } from "react";

const config = createConfig({
  relaysList: [
    "wss://relay.damus.io",
    "wss://relay.hodl.ar",
    "wss://relay.primal.net",
    "wss://nos.lol",
    "wss://nostr-pub.wellorder.net",
    "wss://relay.lawallet.ar",
  ],
});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextProvider theme={appTheme}>
      <NostrProvider config={config}>
        <Suspense>
          <Container>
            <Navbar />

            <Divider y={16} />

            {children}

            <Divider y={16} />

            <Footer />
          </Container>
        </Suspense>
      </NostrProvider>
    </NextProvider>
  );
};

export default AppProvider;
