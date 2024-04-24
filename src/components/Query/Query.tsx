import { appTheme } from "@/config/theme";
import { useAppContext } from "@/context/AppProvider";
import { exportJSON, validateNDKFilter } from "@/utils";
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
import { NDKEvent, NDKFilter, NostrEvent } from "@nostr-dev-kit/ndk";
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
  const { JSONQuery, setJSONQuery } = useAppContext();

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

    setJSONQuery(
      validateNDKFilter(newQuery.updated_src as NDKFilter) as NDKFilter
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
    const queryParam = params.get("filter");
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

      <Heading as="h4">Events ({nostrEvents.length}): </Heading>

      {nostrEvents.length ? (
        <>
          <Flex align="start" justify="start">
            <LinkButton
              onClick={() => exportJSON(nostrEvents)}
              variant="borderless"
              size="small"
            >
              Export all events
            </LinkButton>
          </Flex>

          <Divider y={16} />

          {nostrEvents.map((event) => {
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
          })}
        </>
      ) : null}
      {selectedEvent && (
        <Sheet isOpen={true} onClose={() => setSelectedEvent(null)}>
          <Container>
            <Heading as="h3" align="center">
              Event {formatAddress(selectedEvent.id!, 20)}
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
