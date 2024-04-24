"use client";
import { appTheme } from "@/config/theme";
import { Container, Divider, Flex, Heading, Text } from "@lawallet/ui";
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
    </Container>
  );
}
