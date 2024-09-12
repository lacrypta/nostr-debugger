"use client";
import { appTheme } from "@/config/theme";
import { useActionOnKeypress } from "@/hooks/useActionOnKeypress";
import { useNostr } from "@lawallet/react";
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

  const { ndk } = useNostr();

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

    const confirmation = confirm(
      "Are you sure you want to delete this relay from the list?"
    );

    if (confirmation) {
      if (connectionRelaysList.includes(relay)) disconnectRelay(relay);
      saveRelaysOnStorage(storagedRelayList.filter((r) => r !== relay));
    }
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
        List of relays:{" "}
      </Heading>

      <Divider y={16} />

      <Container size="small">
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

        <Divider y={16} />

        {storagedRelayList.map((relay: string) => {
          return (
            <React.Fragment key={`${relay}+${connectionRelaysList.length}`}>
              <Card>
                <Flex direction="column">
                  <Flex direction="row" justify="center" align="center" gap={4}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="16"
                      height="16"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill={
                          connectionRelaysList.includes(relay)
                            ? appTheme.colors.success
                            : appTheme.colors.error
                        }
                        d="M44,24c0,11-9,20-20,20S4,35,4,24S13,4,24,4S44,13,44,24z"
                      ></path>
                    </svg>

                    <Text>{relay}</Text>

                    <Flex
                      flex={1}
                      align="end"
                      justify="end"
                      onClick={() => handleRemoveRelay(relay)}
                    >
                      <svg
                        style={{ cursor: "pointer " }}
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="16"
                        height="16"
                        viewBox="0 0 128 128"
                      >
                        <path
                          fill={appTheme.colors.error}
                          d="M 49 1 C 47.34 1 46 2.34 46 4 C 46 5.66 47.34 7 49 7 L 79 7 C 80.66 7 82 5.66 82 4 C 82 2.34 80.66 1 79 1 L 49 1 z M 24 15 C 16.83 15 11 20.83 11 28 C 11 35.17 16.83 41 24 41 L 101 41 L 101 104 C 101 113.37 93.37 121 84 121 L 44 121 C 34.63 121 27 113.37 27 104 L 27 52 C 27 50.34 25.66 49 24 49 C 22.34 49 21 50.34 21 52 L 21 104 C 21 116.68 31.32 127 44 127 L 84 127 C 96.68 127 107 116.68 107 104 L 107 40.640625 C 112.72 39.280625 117 34.14 117 28 C 117 20.83 111.17 15 104 15 L 24 15 z M 24 21 L 104 21 C 107.86 21 111 24.14 111 28 C 111 31.86 107.86 35 104 35 L 24 35 C 20.14 35 17 31.86 17 28 C 17 24.14 20.14 21 24 21 z M 50 55 C 48.34 55 47 56.34 47 58 L 47 104 C 47 105.66 48.34 107 50 107 C 51.66 107 53 105.66 53 104 L 53 58 C 53 56.34 51.66 55 50 55 z M 78 55 C 76.34 55 75 56.34 75 58 L 75 104 C 75 105.66 76.34 107 78 107 C 79.66 107 81 105.66 81 104 L 81 58 C 81 56.34 79.66 55 78 55 z"
                        ></path>
                      </svg>
                    </Flex>
                  </Flex>

                  <Divider y={24} />

                  <Flex>
                    <Divider y={16} />

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
                      <Button
                        size="small"
                        style={{
                          color: appTheme.colors.primary,
                        }}
                        variant="borderless"
                      >
                        {connectionRelaysList.includes(relay)
                          ? "Disconnect"
                          : "Connect"}
                      </Button>
                    </Flex>
                  </Flex>
                </Flex>
              </Card>

              <Divider y={16} />
            </React.Fragment>
          );
        })}
      </Container>
    </Container>
  );
};

export default Page;
