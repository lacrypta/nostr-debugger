"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { appTheme } from "@/config/theme";
import { encodeBase64Filter } from "@/utils";
import {
  NostrProvider,
  createConfig,
  nowInSeconds,
  useNostr,
} from "@lawallet/react";
import { Container, Divider, Loader } from "@lawallet/ui";
import { NextProvider } from "@lawallet/ui/next";
import { NDKFilter, NDKKind, NostrEvent } from "@nostr-dev-kit/ndk";
import { usePathname } from "next/navigation";
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
  const { signerInfo } = useNostr();

  const [privateKey, setPrivateKey] = useState<string>("");
  const pathname = usePathname();

  const [JSONQuery, setJSONQuery] = useState<NDKFilter>({
    ids: undefined,
    kinds: undefined,
    authors: undefined,
    since: undefined,
    until: undefined,
    "#t": undefined,
    "#d": undefined,
    "#p": undefined,
    "#e": undefined,
    "#a": undefined,
    limit: 1000,
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
    params.set("filter", encodeBase64Filter(newQuery));
    window.history.replaceState(
      {},
      "",
      decodeURIComponent(`${window.location.pathname}?${params}`)
    );
  };

  useEffect(() => {
    if (pathname === "/query") setFilterOnURLQuery(JSONQuery);
  }, [JSONQuery, pathname]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [relaysList, setRelaysList] = useState<string[]>([]);

  const setDefaultRelays = () => {
    setRelaysList(config.relaysList);
    return;
  };

  useEffect(() => {
    const storagedRelays = localStorage.getItem("relays");
    if (!storagedRelays) return setDefaultRelays();

    const parsedStoragedRelays = JSON.parse(storagedRelays);
    if (parsedStoragedRelays && parsedStoragedRelays.length < 0)
      return setDefaultRelays();

    setRelaysList(parsedStoragedRelays);
  }, []);

  return (
    <NextProvider theme={appTheme}>
      {relaysList.length === 0 ? (
        <Loader />
      ) : (
        <NostrProvider config={{ ...config, relaysList }}>
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
      )}
    </NextProvider>
  );
};

export default AppProvider;
