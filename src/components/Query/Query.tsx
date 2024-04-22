import { useSubscription } from "@lawallet/react";
import {
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Sheet,
  Text,
} from "@lawallet/ui";
import { NDKEvent, NDKFilter, NDKKind, NostrEvent } from "@nostr-dev-kit/ndk";
import { useEffect, useState } from "react";
import ReactJson, {
  InteractionProps,
  ReactJsonViewProps,
  ThemeKeys,
} from "react-json-view";

const DefaultJsonViewOptions: Partial<ReactJsonViewProps> = {
  name: false,
  theme: "apathy:inverted" as ThemeKeys,
  displayObjectSize: false,
  displayDataTypes: false,
  collapseStringsAfterLength: 25,
};

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
      <ReactJson
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
              <Flex
                key={event.id}
                onClick={async () => {
                  const nostrEvent: NostrEvent = await event.toNostrEvent();
                  setSelectedEvent(nostrEvent);
                }}
              >
                <Text>{event.id}</Text>
              </Flex>
            );
          })
        : null}

      {selectedEvent && (
        <Sheet isOpen={true} onClose={() => setSelectedEvent(null)}>
          <Heading as="h3" align="center">
            Event {selectedEvent.id}
          </Heading>

          <Divider y={16} />
          <ReactJson src={selectedEvent} {...DefaultJsonViewOptions} />
        </Sheet>
      )}
    </>
  );
};

export default QueryComponent;
