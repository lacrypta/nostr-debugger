"use client";
import CardButton from "@/components/CardButton/CardButton";
import { Container, Divider, Heading } from "@lawallet/ui";
import { useRouter } from "next/navigation";
import React from "react";

const Auditor = () => {
  const router = useRouter();
  return (
    <Container>
      <Divider y={16} />

      <Heading as="h3">LaWallet Auditor</Heading>

      <Divider y={16} />

      <CardButton
        text="Get user account"
        onClick={() => router.push("/auditor/get-account")}
      />

      <Divider y={16} />

      <CardButton
        text="Get user balance"
        onClick={() => router.push("/auditor/get-balance")}
      />

      <Divider y={16} />

      <CardButton
        text="Get user transfers"
        onClick={() => router.push("/auditor/get-transfers")}
      />

      <Divider y={16} />
    </Container>
  );
};

export default Auditor;
