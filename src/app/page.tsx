"use client";
import QueryComponent from "@/components/Query/Query";
import { appTheme } from "@/config/theme";
import { Button, Container, Divider, Flex, Heading, Text } from "@lawallet/ui";

export default function Home() {
  return (
    <Container>
      <Divider y={16} />

      <Flex flex={0} direction="row" gap={16}>
        <Heading>Nostr Debug</Heading>

        <Flex flex={1} gap={16} justify="end">
          <Text color={appTheme.colors.success}>Query</Text>

          <Text color={appTheme.colors.success}>Relays</Text>
        </Flex>
      </Flex>

      <Divider y={16} />

      <QueryComponent />
    </Container>
  );
}
