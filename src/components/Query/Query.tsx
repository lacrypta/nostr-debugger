import { useSubscription } from "@lawallet/react";
import { Button, Divider, Flex, Heading, Text } from "@lawallet/ui";
import { NDKFilter, NDKKind, NostrEvent } from "@nostr-dev-kit/ndk";
import { useEffect, useState } from "react";
import ReactJson, { InteractionProps } from "react-json-view";

const QueryComponent = () => {
  const [enabledSubscription, setEnabledSubscription] = useState(false);
  const [nostrEvents, setNostrEvents] = useState<NostrEvent[]>([]);
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
      Object.fromEntries(events.map((event) => [event.id, event as NostrEvent]))
    );

    setNostrEvents(deduplicated.sort((a, b) => b.created_at - a.created_at));
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
        name={false}
        displayObjectSize={false}
        displayDataTypes={false}
        collapseStringsAfterLength={25}
        theme={"apathy:inverted"}
        onEdit={handleEditQuery}
        onAdd={handleEditQuery}
        onDelete={handleEditQuery}
      />

      <Divider y={16} />

      <Flex>
        <Button onClick={() => setEnabledSubscription(!enabledSubscription)}>
          {enabledSubscription
            ? "Desactivar subscripción"
            : "Activar subscripción"}
        </Button>
      </Flex>

      <Divider y={16} />
      <Heading as="h2">Eventos ({nostrEvents.length})</Heading>
      <Divider y={16} />
      {nostrEvents.length
        ? nostrEvents.map((event) => {
            return <Text key={event.id}>{event.id}</Text>;
          })
        : null}
    </>
  );
};

export default QueryComponent;
