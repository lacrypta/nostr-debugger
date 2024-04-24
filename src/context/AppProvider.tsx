"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { appTheme } from "@/config/theme";
import {
  NostrProvider,
  createConfig,
  nowInSeconds,
  useNostrContext,
} from "@lawallet/react";
import { Container, Divider } from "@lawallet/ui";
import { NextProvider } from "@lawallet/ui/next";
import { NDKFilter, NDKKind, NostrEvent } from "@nostr-dev-kit/ndk";
import React, {
  Dispatch,
  SetStateAction,
  Suspense,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

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

interface AppInterface {
  JSONQuery: NDKFilter;
  setJSONQuery: Dispatch<SetStateAction<NDKFilter>>;
  eventToPublish: NostrEvent;
  setEventToPublish: Dispatch<SetStateAction<NostrEvent>>;
  privateKey: string;
  setPrivateKey: Dispatch<SetStateAction<string>>;
}

const AppContext = createContext({} as AppInterface);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
};

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const { signerInfo } = useNostrContext();

  const [privateKey, setPrivateKey] = useState<string>("");
  // const pathname = usePathname();

  const [JSONQuery, setJSONQuery] = useState<NDKFilter>({
    kinds: [31111 as NDKKind],
    authors: [
      "bd9b0b60d5cd2a9df282fc504e88334995e6fac8b148fa89e0f8c09e2a570a84",
    ],
    since: undefined,
    until: undefined,
    "#t": undefined,
    "#p": undefined,
    "#e": undefined,
    "#a": undefined,
    limit: 100,
  });

  const [eventToPublish, setEventToPublish] = useState<NostrEvent>({
    kind: 1,
    pubkey: signerInfo?.pubkey || "",
    created_at: nowInSeconds(),
    content: "",
    tags: [],
  } as NostrEvent);

  const value: AppInterface = {
    JSONQuery,
    setJSONQuery,
    eventToPublish,
    setEventToPublish,
    privateKey,
    setPrivateKey,
  };

  const setFilterOnURLQuery = (newQuery: NDKFilter) => {
    const params = new URLSearchParams(window.location.search);
    params.set("query", btoa(JSON.stringify(newQuery)));
    window.history.replaceState(
      {},
      "",
      decodeURIComponent(`${window.location.pathname}?${params}`)
    );
  };

  useEffect(() => {
    setFilterOnURLQuery(JSONQuery);
  }, [JSONQuery]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextProvider theme={appTheme}>
      <NostrProvider config={config}>
        <GlobalProvider>
          <Suspense>
            <Container>
              <Navbar />

              <Divider y={16} />

              {children}

              <Divider y={16} />

              <Footer />
            </Container>
          </Suspense>
        </GlobalProvider>
      </NostrProvider>
    </NextProvider>
  );
};

export default AppProvider;
