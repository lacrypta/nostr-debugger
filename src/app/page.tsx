"use client";
import Navbar from "@/components/Navbar/Navbar";
import QueryComponent from "@/components/Query/Query";
import { Container, Divider } from "@lawallet/ui";

export default function Home() {
  return (
    <Container>
      <Divider y={16} />

      <Navbar />

      <Divider y={16} />

      <QueryComponent />
    </Container>
  );
}
