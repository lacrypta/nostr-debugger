"use client";
import { useActionOnKeypress } from "@/hooks/useActionOnKeypress";
import { encodeBase64Filter } from "@/utils";
import { getUserPubkey } from "@lawallet/react/actions";
import {
  Button,
  Container,
  Divider,
  Feedback,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputGroupRight,
  Text,
} from "@lawallet/ui";
import { NDKFilter, NDKKind } from "@nostr-dev-kit/ndk";
import { useRouter } from "next/navigation";
import { useState } from "react";

const GetAccount = () => {
  const [inputHandle, setInputHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleApplyFilter = async () => {
    setLoading(true);

    const userPubkey = await getUserPubkey(inputHandle);
    if (!userPubkey) {
      setLoading(false);
      setError("Username does not exist");
      return;
    }

    const filters: Partial<NDKFilter> = {
      kinds: [1112 as NDKKind],
      authors: [
        "bd9b0b60d5cd2a9df282fc504e88334995e6fac8b148fa89e0f8c09e2a570a84",
        userPubkey,
      ],
      "#t": [
        "internal-transaction-start",
        "inbound-transaction-start",
        "internal-transaction-ok",
        "internal-transaction-error",
        "inbound-transaction-ok",
        "inbound-transaction-error",
        "outbound-transaction-ok",
        "outbound-transaction-error",
      ],
      "#p": [userPubkey],
    };

    const encodedFilter = encodeBase64Filter(filters);
    router.push(`/query?filter=${encodedFilter}`);

    setLoading(false);
  };

  const handleInput = (e: any) => {
    if (error) setError("");

    const text = e.target.value;
    setInputHandle(text);
  };

  useActionOnKeypress("Enter", handleApplyFilter, [inputHandle]);

  return (
    <Container>
      <Divider y={16} />
      <Heading as="h3">Define account user name</Heading>
      <Divider y={16} />
      <InputGroup>
        <Input placeholder="example" name="example" onChange={handleInput} />
        <InputGroupRight>
          <Text size="small">@lawallet.ar</Text>
        </InputGroupRight>
      </InputGroup>
      <Divider y={16} />
      <Flex>
        <Button
          loading={loading}
          disabled={loading}
          onClick={handleApplyFilter}
        >
          Apply filter
        </Button>
      </Flex>

      <Feedback
        show={Boolean(error.length)}
        status={error.length ? "error" : undefined}
      >
        {error}
      </Feedback>
    </Container>
  );
};

export default GetAccount;
