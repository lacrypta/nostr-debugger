"use client";
import { appTheme } from "@/config/theme";
import {
  ButtonSetting,
  CaretRightIcon,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  Text,
} from "@lawallet/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <Container>
      <Divider y={16} />

      <Heading as="h3">Welcome to</Heading>
      <Heading as="h3">Nostr Protocol Debugger</Heading>

      <Divider y={16} />

      <Text>
        Nostr Protocol Debugger allows you to debug events of the Nostr
        protocol.
      </Text>

      <Divider y={16} />

      <Text>
        The project repository is open source, and you can view the link{" "}
        <Link
          style={{
            textDecorationColor: "none",
            color: appTheme.colors.primary,
          }}
          href={"https://github.com/feririarte10/nostr-debugger"}
        >
          here.
        </Link>
      </Text>

      <Divider y={16} />

      <Heading as="h4">Shortcuts: </Heading>

      <Divider y={16} />

      <ButtonSetting onClick={() => router.push("/query")}>
        <Flex flex={1} align="start" justify="start">
          <Text isBold={true}>Start a events query</Text>
        </Flex>

        <Icon size="small" color={appTheme.colors.gray40}>
          <CaretRightIcon />
        </Icon>
      </ButtonSetting>

      <Divider y={16} />

      <ButtonSetting onClick={() => router.push("/publish")}>
        <Flex flex={1} align="start" justify="start">
          <Text isBold={true}>Publish event</Text>
        </Flex>

        <Icon size="small" color={appTheme.colors.gray40}>
          <CaretRightIcon />
        </Icon>
      </ButtonSetting>

      <Divider y={16} />

      <ButtonSetting onClick={() => router.push("/relays")}>
        <Flex flex={1} align="start" justify="start">
          <Text isBold={true}>Manage relays</Text>
        </Flex>

        <Icon size="small" color={appTheme.colors.gray40}>
          <CaretRightIcon />
        </Icon>
      </ButtonSetting>
    </Container>
  );
}
