"use client";
import {
  DefaultJsonViewOptions,
  DynamicJSONView,
} from "@/components/Query/Query";
import { useAppContext } from "@/context/AppProvider";
import { nowInSeconds, useNostrContext } from "@lawallet/react";
import {
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Input,
  Text,
} from "@lawallet/ui";
import { NDKEvent, NDKPrivateKeySigner, NostrEvent } from "@nostr-dev-kit/ndk";
import { generatePrivateKey } from "nostr-tools";
import { useCallback, useEffect } from "react";
import { InteractionProps } from "react-json-view";

const Page = () => {
  const { ndk, providers, authWithExtension, initializeSigner, signerInfo } =
    useNostrContext();

  const { eventToPublish, setEventToPublish, privateKey, setPrivateKey } =
    useAppContext();

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
      <Heading as="h3" align="center">
        Event to publish:{" "}
      </Heading>

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
          <Button
            variant={eventToPublish.sig ? "borderless" : "filled"}
            onClick={publishEvent}
          >
            {eventToPublish.sig ? "Publish" : "Sign"}
          </Button>
        </Flex>
      </Flex>

      <Divider y={16} />

      <Heading as="h3" align="center">
        Keys Info:{" "}
      </Heading>

      <Divider y={16} />

      <Flex flex={1} direction="column" align="center">
        <Text align="center" isBold={true}>
          Private key
        </Text>

        <Divider y={16} />

        <Input
          placeholder="Paste private key"
          onChange={handleChangePrivateKey}
          value={privateKey}
        />
        {Boolean(signerInfo?.pubkey.length) ? (
          <>
            <Flex direction="column" align="center">
              <Divider y={16} />
              <Text align="center" isBold={true}>
                Pubkey
              </Text>
              <Divider y={16} />
              <Text>{signerInfo?.pubkey}</Text>
              <Divider y={16} />
              <Text align="center" isBold={true}>
                npub
              </Text>
              <Divider y={16} />
              <Text>{signerInfo?.npub}</Text>
            </Flex>
          </>
        ) : null}

        <Divider y={16} />

        <Flex justify="space-between">
          <Button variant="borderless" onClick={handleNewPrivKey}>
            Generate new private key
          </Button>

          {providers.webln && !signerInfo && (
            <Button variant="borderless" onClick={authWithExtension}>
              Connect with Alby
            </Button>
          )}
        </Flex>
      </Flex>
    </Container>
  );
};

export default Page;
