import { appTheme } from "@/config/theme";
import { Flex, Heading, LinkButton, Text } from "@lawallet/ui";
import { useRouter } from "next/navigation";
import React from "react";

const Navbar = () => {
  const router = useRouter();
  return (
    <Flex flex={0} direction="row" gap={16}>
      <Heading>Nostr Debug</Heading>

      <Flex flex={1} gap={16} justify="end">
        <LinkButton variant="borderless" onClick={() => router.push("/")}>
          <Text color={appTheme.colors.success}>Query</Text>
        </LinkButton>

        <LinkButton variant="borderless" onClick={() => router.push("/relays")}>
          <Text color={appTheme.colors.success}>Relays</Text>
        </LinkButton>
      </Flex>
    </Flex>
  );
};

export default Navbar;
