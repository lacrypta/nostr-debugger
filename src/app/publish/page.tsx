"use client";
import Navbar from "@/components/Navbar/Navbar";
import {
  DefaultJsonViewOptions,
  DynamicJSONView,
} from "@/components/Query/Query";
import { nowInSeconds, useNostrContext } from "@lawallet/react";
import { Button, Container, Divider, Flex, Input, Text } from "@lawallet/ui";
import { NDKEvent, NDKPrivateKeySigner, NostrEvent } from "@nostr-dev-kit/ndk";
import { useCallback, useEffect, useState } from "react";
import { InteractionProps } from "react-json-view";

const Page = () => {
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

  const publishEvent = useCallback(async () => {
    if (!signerInfo) return alert("no signer");
    const ndkEvent = new NDKEvent(ndk, eventToPublish);

    if (!eventToPublish.sig) {
      await ndkEvent.sign();
      setEventToPublish(await ndkEvent.toNostrEvent());
    } else {
      ndkEvent.publish();
    }
  }, [signerInfo, ndk, eventToPublish]);

  const handleChangePrivateKey = (e: any) => {
    try {
      const pv = e.target.value;
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

      <Input placeholder="Private key" onChange={handleChangePrivateKey} />
      {Boolean(signerInfo?.pubkey.length) ? (
        <>
          <Divider y={16} />
          <Text>Pubkey: {signerInfo?.pubkey}</Text>
        </>
      ) : null}

      <Divider y={16} />

      <DynamicJSONView
        src={eventToPublish}
        onAdd={handleEditJSON}
        onEdit={handleEditJSON}
        onDelete={handleEditJSON}
        {...DefaultJsonViewOptions}
      />

      <Divider y={16} />

      <Flex>
        <Button onClick={publishEvent}>
          {eventToPublish.sig ? "Publicar" : "Firmar"}
        </Button>
      </Flex>
    </Container>
  );
};

export default Page;
