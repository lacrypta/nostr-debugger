"use client";
import CardButton from "@/components/CardButton/CardButton";
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
          href={"https://github.com/lacrypta/nostr-debugger"}
        >
          here.
        </Link>
      </Text>

      <Divider y={16} />

      <Heading as="h4">Shortcuts: </Heading>

      <Divider y={16} />

      <CardButton
        text="Start a events query"
        onClick={() => router.push("/query")}
      />

      <Divider y={16} />

      <CardButton
        text="Publish event"
        onClick={() => router.push("/publish")}
      />

      <Divider y={16} />

      <CardButton text="Manage relays" onClick={() => router.push("/relays")} />
    </Container>
  );
}
