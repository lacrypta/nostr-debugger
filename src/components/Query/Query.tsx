import { appTheme } from "@/config/theme";
import {
  formatAddress,
  nowInSeconds,
  useFormatter,
  useSubscription,
} from "@lawallet/react";
import {
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  LinkButton,
  Sheet,
  Text,
} from "@lawallet/ui";
import { NDKEvent, NDKFilter, NDKKind, NostrEvent } from "@nostr-dev-kit/ndk";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  InteractionProps,
  ReactJsonViewProps,
  ThemeKeys,
} from "react-json-view";

export const DefaultJsonViewOptions: Partial<ReactJsonViewProps> = {
  name: false,
  theme: "brewer" as ThemeKeys,
  displayObjectSize: false,
  displayDataTypes: false,
  collapseStringsAfterLength: 25,
};

export const DynamicJSONView = dynamic(() => import("react-json-view"), {
  ssr: false,
});

const QueryComponent = () => {
  const [selectedEvent, setSelectedEvent] = useState<NostrEvent | null>(null);
  const [enabledSubscription, setEnabledSubscription] = useState(false);
  const [nostrEvents, setNostrEvents] = useState<NDKEvent[]>([]);

  const params = useSearchParams();

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

    const params = new URLSearchParams(window.location.search);
    params.set("query", btoa(JSON.stringify(newQuery.updated_src)));
    window.history.replaceState(
      {},
      "",
      decodeURIComponent(`${window.location.pathname}?${params}`)
    );

    setEnabledSubscription(false);
  };

  useEffect(() => {
    if (events.length) loadNostrEvents();
  }, [events]);

  useEffect(() => {
    if (enabledSubscription) setNostrEvents([]);
  }, [enabledSubscription]);

  useEffect(() => {
    const queryParam = params.get("query");
    if (!queryParam) return;

    try {
      const decodedQuery = JSON.parse(atob(queryParam));

      setJSONQuery(decodedQuery);
    } catch {
      console.log("error al decodificar la query");
    }
  }, []);

  return (
    <>
      <Flex justify="space-between">
        <Heading as="h3">Filters:</Heading>

        <Flex
          justify="end"
          onClick={() => {
            setJSONQuery((prev) => {
              return { ...prev, since: nowInSeconds() };
            });
          }}
        >
          <Text color={appTheme.colors.primary}>Set date now</Text>
        </Flex>
      </Flex>

      <Divider y={16} />

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
          {enabledSubscription ? "Stop subscription" : "Start subscription"}
        </Button>

        <Button variant="borderless" onClick={() => setNostrEvents([])}>
          Reset events
        </Button>
      </Flex>

      <Divider y={16} />

      {/* <Container size="small"> */}
      <Heading as="h4">Events ({nostrEvents.length}):</Heading>

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

                  <Text color={appTheme.colors.success}>Display</Text>
                </Flex>

                <Divider y={16} />
              </React.Fragment>
            );
          })
        : null}

      {selectedEvent && (
        <Sheet isOpen={true} onClose={() => setSelectedEvent(null)}>
          <Container>
            <Heading as="h3" align="center">
              Event {selectedEvent.id}
            </Heading>

            <Divider y={16} />

            <DynamicJSONView src={selectedEvent} {...DefaultJsonViewOptions} />

            <Divider y={16} />

            <Flex direction="column">
              <Heading as="h4">Date: </Heading>

              <Divider y={16} />

              <Text isBold>{formatDate(selectedEvent.created_at * 1000)}</Text>
            </Flex>
          </Container>
        </Sheet>
      )}
    </>
  );
};

export default QueryComponent;
