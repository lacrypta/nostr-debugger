"use client";
import Navbar from "@/components/Navbar/Navbar";
import { useNostrContext } from "@lawallet/react";
import {
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Input,
  LinkButton,
  Text,
} from "@lawallet/ui";
import React, {
  ReactEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";

const Page = () => {
  const [inputRelay, setInputRelay] = useState<string>("");
  const [relaysList, setRelaysList] = useState<string[]>([]);
  const { ndk } = useNostrContext();

  const reloadRelays = useCallback(() => {
    const relays = Object.keys(Object.fromEntries(ndk.pool.relays));
    setRelaysList(relays);
  }, [ndk]);

  const handleAddRelay = (relay: string) => {
    ndk.addExplicitRelay(relay);
    reloadRelays();
  };

  const handleChangeInput = (e: any) => {
    const text: string = e.target.value;
    setInputRelay(text);
  };

  const removeRelay = (relay: string) => {
    try {
      ndk.pool.removeRelay(relay);
      ndk.outboxPool?.removeRelay(relay);
      reloadRelays();
    } catch {
      console.log("error al remover el relay");
    }
  };

  useEffect(() => {
    reloadRelays();
  }, [ndk]);

  return (
    <Container>
      <Divider y={16} />

      <Navbar />

      <Divider y={16} />

      <Heading as="h3" align="center">
        Listado de relays:{" "}
      </Heading>

      <Divider y={16} />

      <Container size="small">
        {relaysList.map((relay) => {
          return (
            <Flex key={relay} direction="column">
              <Text>{relay}</Text>

              <LinkButton
                variant="borderless"
                onClick={() => removeRelay(relay)}
              >
                Eliminar
              </LinkButton>
            </Flex>
          );
        })}

        <Divider y={16} />

        <Flex direction="column" justify="center" align="center">
          <Input
            onChange={handleChangeInput}
            placeholder="wss://relay.example.com"
          />

          <Divider y={16} />

          <Button onClick={() => handleAddRelay(inputRelay)}>Agregar</Button>
        </Flex>
      </Container>
    </Container>
  );
};

export default Page;
