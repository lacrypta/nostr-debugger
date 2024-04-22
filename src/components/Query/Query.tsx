import { appTheme } from "@/config/theme";
import { formatAddress, useFormatter, useSubscription } from "@lawallet/react";
import { Button, Divider, Flex, Heading, Sheet, Text } from "@lawallet/ui";
import { NDKEvent, NDKFilter, NDKKind, NostrEvent } from "@nostr-dev-kit/ndk";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import {
  InteractionProps,
  ReactJsonViewProps,
  ThemeKeys,
} from "react-json-view";

const DefaultJsonViewOptions: Partial<ReactJsonViewProps> = {
  name: false,
  theme: "brewer" as ThemeKeys,
  displayObjectSize: false,
  displayDataTypes: false,
  collapseStringsAfterLength: 25,
};

const DynamicJSONView = dynamic(() => import("react-json-view"), {
  ssr: false,
});

const QueryComponent = () => {
  const [selectedEvent, setSelectedEvent] = useState<NostrEvent | null>(null);
  const [enabledSubscription, setEnabledSubscription] = useState(false);
  const [nostrEvents, setNostrEvents] = useState<NDKEvent[]>([]);
  const [JSONQuery, setJSONQuery] = useState<NDKFilter>({
    kinds: [31111 as NDKKind],
    authors: [
      "bd9b0b60d5cd2a9df282fc504e88334995e6fac8b148fa89e0f8c09e2a570a84",
    ],
    since: undefined,
    until: undefined,
    "#p": undefined,
    "#e": undefined,
    "#a": undefined,
    limit: 100,
  });

  const { formatDate } = useFormatter({});

  const { events } = useSubscription({
    filters: [JSONQuery],
    options: { closeOnEose: false },
    enabled: enabledSubscription,
  });

  const loadNostrEvents = () => {
    const deduplicated = Object.values(
      Object.fromEntries(events.map((event) => [event.id, event as NDKEvent]))
    );

    setNostrEvents(deduplicated.sort((a, b) => b.created_at! - a.created_at!));
  };

  const handleEditQuery = (newQuery: InteractionProps) => {
    if (!newQuery || !newQuery.updated_src) return;
    setJSONQuery(newQuery.updated_src as NDKFilter);
    setEnabledSubscription(false);
  };

  useEffect(() => {
    if (events.length) loadNostrEvents();
  }, [events]);

  useEffect(() => {
    if (enabledSubscription) setNostrEvents([]);
  }, [enabledSubscription]);

  return (
    <>
      <DynamicJSONView
        src={JSONQuery}
        onEdit={handleEditQuery}
        onAdd={handleEditQuery}
        onDelete={handleEditQuery}
        {...DefaultJsonViewOptions}
      />

      <Divider y={16} />

      <Flex>
        <Button onClick={() => setEnabledSubscription(!enabledSubscription)}>
          {enabledSubscription
            ? "Desactivar subscripción"
            : "Activar subscripción"}
        </Button>

        <Button variant="borderless" onClick={() => setNostrEvents([])}>
          Reiniciar eventos
        </Button>
      </Flex>

      <Divider y={16} />

      {/* <Container size="small"> */}
      <Heading as="h4">Eventos ({nostrEvents.length})</Heading>

      <Divider y={16} />

      {nostrEvents.length
        ? nostrEvents.map((event) => {
            return (
              <React.Fragment key={event.id}>
                <Flex
                  onClick={async () => {
                    const nostrEvent: NostrEvent = await event.toNostrEvent();
                    setSelectedEvent(nostrEvent);
                  }}
                  justify="space-between"
                >
                  <Text>{formatAddress(event.id, 30)}</Text>

                  <Text color={appTheme.colors.success}>Ver</Text>
                </Flex>

                <Divider y={16} />
              </React.Fragment>
            );
          })
        : null}

      {selectedEvent && (
        <Sheet isOpen={true} onClose={() => setSelectedEvent(null)}>
          <Heading as="h3" align="center">
            Event {selectedEvent.id}
          </Heading>

          <Divider y={16} />

          <DynamicJSONView src={selectedEvent} {...DefaultJsonViewOptions} />

          <Divider y={16} />

          <Flex direction="column">
            <Heading as="h4">Fecha: </Heading>

            <Divider y={16} />

            <Text isBold>{formatDate(selectedEvent.created_at * 1000)}</Text>
          </Flex>
        </Sheet>
      )}
    </>
  );
};

export default QueryComponent;
