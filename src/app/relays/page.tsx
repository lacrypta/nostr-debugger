"use client";
import { appTheme } from "@/config/theme";
import { useActionOnKeypress } from "@/hooks/useActionOnKeypress";
import { useNostrContext } from "@lawallet/react";
import {
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Heading,
  Input,
  Text,
} from "@lawallet/ui";
import React, { useCallback, useEffect, useState } from "react";

const Page = () => {
  const [inputRelay, setInputRelay] = useState<string>("");

  const [storagedRelayList, setStoragedRelayList] = useState<string[]>([]);

  const [connectionRelaysList, setConnectionRelaysList] = useState<string[]>(
    []
  );

  const { ndk } = useNostrContext();

  const reloadConnectedRelays = useCallback(() => {
    const relays = Object.keys(Object.fromEntries(ndk.pool.relays));
    setConnectionRelaysList(relays);
  }, [ndk]);

  const handleAddRelay = () => {
    if (storagedRelayList.includes(inputRelay)) return;

    connectRelay(inputRelay);

    const new_relays = [...storagedRelayList, inputRelay];
    saveRelaysOnStorage(new_relays);
  };

  const handleChangeInput = (e: any) => {
    const text: string = e.target.value;
    setInputRelay(text);
  };

  const connectRelay = (relay: string) => {
    if (connectionRelaysList.includes(relay)) return;
    ndk.addExplicitRelay(relay, undefined, true);
    reloadConnectedRelays();
    // setConnectionRelaysList((prev) => [...prev, relay]);
  };

  const disconnectRelay = (relay: string) => {
    try {
      if (!storagedRelayList.includes(relay)) return;

      ndk.pool.removeRelay(relay);
      ndk.outboxPool?.removeRelay(relay);
      reloadConnectedRelays();
    } catch {
      console.log("error al remover el relay");
    }
  };

  const handleRemoveRelay = (relay: string) => {
    if (!storagedRelayList.includes(relay)) return;

    if (connectionRelaysList.includes(relay)) disconnectRelay(relay);
    saveRelaysOnStorage(storagedRelayList.filter((r) => r !== relay));
  };

  const saveRelaysOnStorage = (relays: string[]) => {
    setStoragedRelayList(relays);
    localStorage.setItem("relays", JSON.stringify(relays));
  };

  const loadStoragedRelays = () => {
    try {
      const storagedRelays = localStorage.getItem("relays");
      if (!storagedRelays) {
        saveRelaysOnStorage(connectionRelaysList);
        return;
      }

      const parsedStoragedRelays = JSON.parse(storagedRelays);
      if (parsedStoragedRelays && parsedStoragedRelays.length === 0) {
        saveRelaysOnStorage(connectionRelaysList);
        return;
      }

      setStoragedRelayList(parsedStoragedRelays);
    } catch {
      console.log("error al cargar relays guardados");
    }
  };

  useEffect(() => {
    reloadConnectedRelays();
  }, [ndk]);

  useEffect(() => {
    loadStoragedRelays();
  }, [connectionRelaysList]);

  useActionOnKeypress("Enter", handleAddRelay, [inputRelay]);

  return (
    <Container>
      <Heading as="h3" align="center">
        List of relays connections:{" "}
      </Heading>

      <Divider y={16} />

      <Container size="small">
        {storagedRelayList.map((relay) => {
          return (
            <React.Fragment key={`${relay}+${connectionRelaysList.length}`}>
              <Card>
                <Flex direction="column">
                  <Flex direction="row" justify="center" align="center">
                    <Text>{relay}</Text>

                    <Flex
                      flex={1}
                      align="end"
                      justify="end"
                      onClick={() => handleRemoveRelay(relay)}
                    >
                      <Text color={appTheme.colors.error} size="small">
                        Delete
                      </Text>
                    </Flex>
                  </Flex>

                  <Divider y={24} />

                  <Flex>
                    <Text
                      size="small"
                      color={
                        connectionRelaysList.includes(relay)
                          ? appTheme.colors.success
                          : appTheme.colors.gray45
                      }
                    >
                      {connectionRelaysList.includes(relay)
                        ? "Connected"
                        : "Disconnected"}
                    </Text>

                    <Flex
                      flex={1}
                      align="end"
                      justify="end"
                      onClick={() => {
                        connectionRelaysList.includes(relay)
                          ? disconnectRelay(relay)
                          : connectRelay(relay);
                      }}
                    >
                      <Text color={appTheme.colors.primary} size="small">
                        {connectionRelaysList.includes(relay)
                          ? "Disconnect"
                          : "Connect"}
                      </Text>
                    </Flex>
                  </Flex>
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
          <Button onClick={handleAddRelay}>Add</Button>
        </Flex>
      </Container>
    </Container>
  );
};

export default Page;
