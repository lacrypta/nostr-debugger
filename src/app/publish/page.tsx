"use client";
import Navbar from "@/components/Navbar/Navbar";
import { Container, Divider, Heading } from "@lawallet/ui";

const Page = () => {
  return (
    <Container>
      <Divider y={16} />

      <Navbar />

      <Divider y={16} />

      <Heading>--- BETA (not work) ----</Heading>

      <Divider y={16} />
    </Container>
  );
};

export default Page;
