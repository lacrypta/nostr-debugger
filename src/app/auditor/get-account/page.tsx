"use client";
import { encodeBase64Filter } from "@/utils";
import { normalizeLNDomain, useConfig } from "@lawallet/react";
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
import { NDKFilter } from "@nostr-dev-kit/ndk";
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
      authors: [
        "5166b6cafdd203f8213b751fa96741f8885985ceb76b9c58feca0e1e3e0bf1a8",
      ],
      "#t": ["new-user"],
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
