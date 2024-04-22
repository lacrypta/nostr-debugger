"use client";
import Navbar from "@/components/Navbar/Navbar";
import { useNostrContext } from "@lawallet/react";
import {
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Heading,
  Input,
  LinkButton,
  Text,
} from "@lawallet/ui";
import React, { useCallback, useEffect, useState } from "react";

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
        List of relays connections:{" "}
      </Heading>

      <Divider y={16} />

      <Container size="small">
        {relaysList.map((relay) => {
          return (
            <React.Fragment key={relay}>
              <Card>
                <Flex direction="column">
                  <Text>{relay}</Text>

                  <LinkButton
                    variant="borderless"
                    onClick={() => removeRelay(relay)}
                  >
                    Delete
                  </LinkButton>
                </Flex>
              </Card>

              <Divider y={16} />
            </React.Fragment>
          );
        })}

        <Divider y={16} />

        <Flex direction="column" justify="center" align="center">
          <Input
            onChange={handleChangeInput}
            placeholder="wss://relay.example.com"
          />

          <Divider y={16} />
        </Flex>
        <Flex>
          <Button onClick={() => handleAddRelay(inputRelay)}>Add</Button>
        </Flex>
      </Container>
    </Container>
  );
};

export default Page;
