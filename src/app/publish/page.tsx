"use client";
import Navbar from "@/components/Navbar/Navbar";
import {
  DefaultJsonViewOptions,
  DynamicJSONView,
} from "@/components/Query/Query";
import { nowInSeconds, useNostrContext } from "@lawallet/react";
import { Button, Container, Divider, Flex, Input, Text } from "@lawallet/ui";
import { NDKEvent, NDKPrivateKeySigner, NostrEvent } from "@nostr-dev-kit/ndk";
import { generatePrivateKey } from "nostr-tools";
import { useCallback, useEffect, useState } from "react";
import { InteractionProps } from "react-json-view";

const Page = () => {
  const [privateKey, setPrivateKey] = useState<string>("");
  const { ndk, initializeSigner, signerInfo } = useNostrContext();
  const [eventToPublish, setEventToPublish] = useState<NostrEvent>({
    kind: 1,
    pubkey: signerInfo?.pubkey || "",
    created_at: nowInSeconds(),
    content: "",
    tags: [],
  } as NostrEvent);

  const handleEditJSON = (newQuery: InteractionProps) => {
    setEventToPublish({
      ...newQuery.updated_src,
      created_at: nowInSeconds(),
    } as NostrEvent);
  };

  const handleNewPrivKey = async () => {
    const pvKey = generatePrivateKey();
    const signer = new NDKPrivateKeySigner(pvKey);
    setPrivateKey(pvKey);
    if (signer) initializeSigner(signer);
  };

  const publishEvent = useCallback(async () => {
    if (!signerInfo) return alert("no signer");
    const ndkEvent = new NDKEvent(ndk, eventToPublish);

    if (!eventToPublish.sig) {
      await ndkEvent.sign();
      setEventToPublish(await ndkEvent.toNostrEvent());
    } else {
      const published = await ndkEvent.publish();
      if (published) alert("publish enviado");
    }
  }, [signerInfo, ndk, eventToPublish]);

  const handleChangePrivateKey = (e: any) => {
    try {
      const pv = e.target.value;
      setPrivateKey(pv);

      const signer = new NDKPrivateKeySigner(pv);
      if (signer) initializeSigner(signer);
    } catch {
      console.log("error con clave privada");
    }
  };

  useEffect(() => {
    if (signerInfo && eventToPublish.pubkey !== signerInfo.pubkey)
      setEventToPublish((prev) => {
        return { ...prev, pubkey: signerInfo.pubkey };
      });
  }, [signerInfo]);

  return (
    <Container>
      <Divider y={16} />

      <Navbar />

      <Divider y={16} />

      <DynamicJSONView
        src={eventToPublish}
        onAdd={handleEditJSON}
        onEdit={handleEditJSON}
        onDelete={handleEditJSON}
        {...DefaultJsonViewOptions}
      />

      <Flex flex={1} direction="column" align="center">
        <Divider y={16} />

        <Flex>
          <Button onClick={publishEvent}>
            {eventToPublish.sig ? "Publicar" : "Firmar"}
          </Button>
        </Flex>
      </Flex>

      <Divider y={16} />

      <Flex flex={1} direction="column">
        <Input
          placeholder="Private key"
          onChange={handleChangePrivateKey}
          value={privateKey}
        />
        {Boolean(signerInfo?.pubkey.length) ? (
          <>
            <Divider y={16} />
            <Text>Pubkey: {signerInfo?.pubkey}</Text>
          </>
        ) : null}

        <Divider y={16} />

        <Flex>
          <Button variant="borderless" onClick={handleNewPrivKey}>
            Generar clave privada
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Page;
