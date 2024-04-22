import { appTheme } from "@/config/theme";
import { Flex, Heading, LinkButton, Text } from "@lawallet/ui";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const pathname = usePathname();

  return (
    <Flex flex={0} direction="row" gap={16}>
      {/* <Link href="/">
        <Heading>Nostr Debug</Heading>
      </Link> */}
      <LinkButton onClick={() => router.push("/")} variant="borderless">
        <Heading color={appTheme.colors.success}>Nostr Debug</Heading>
      </LinkButton>

      <Flex flex={1} gap={16} justify="end">
        <LinkButton variant="borderless" onClick={() => router.push("/")}>
          <Text
            color={appTheme.colors[pathname === "/" ? "secondary" : "white"]}
          >
            Query
          </Text>
        </LinkButton>

        <LinkButton
          variant="borderless"
          onClick={() => router.push("/publish")}
        >
          <Text
            color={
              appTheme.colors[pathname === "/publish" ? "secondary" : "white"]
            }
          >
            Publish
          </Text>
        </LinkButton>

        <LinkButton variant="borderless" onClick={() => router.push("/relays")}>
          <Text
            color={
              appTheme.colors[pathname === "/relays" ? "secondary" : "white"]
            }
          >
            Relays
          </Text>
        </LinkButton>
      </Flex>
    </Flex>
  );
};

export default Navbar;
