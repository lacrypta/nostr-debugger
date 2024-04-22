"use client";
import Navbar from "@/components/Navbar/Navbar";
import { useNostrContext } from "@lawallet/react";
import {
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  LinkButton,
  Text,
} from "@lawallet/ui";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [relaysList, setRelaysList] = useState<string[]>([]);
  const { ndk } = useNostrContext();

  useEffect(() => {
    const relays = Object.keys(Object.fromEntries(ndk.pool.relays));
    setRelaysList(relays);
  }, [ndk]);

  //   useEffect(() => {
  //     if (!relaysList.includes("wss://relay.hodl.ar"))
  //       ndk.addExplicitRelay("wss://relay.hodl.ar");
  //     // ndk.outboxPool?.removeRelay("wss://relay.lawallet.ar");
  //   }, []);

  return (
    <Container>
      <Divider y={16} />

      <Navbar />

      <Divider y={16} />

      <Heading>--- BETA (not work) ----</Heading>

      <Divider y={16} />

      <Container size="small">
        {relaysList.map((relay) => {
          return (
            <Flex key={relay} direction="column">
              <Text>{relay}</Text>

              <LinkButton
                variant="borderless"
                onClick={() => ndk.pool.removeRelay(relay)}
              >
                Eliminar
              </LinkButton>
            </Flex>
          );
        })}
      </Container>
    </Container>
  );
};

export default Page;
