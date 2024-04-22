"use client";
import Navbar from "@/components/Navbar/Navbar";
import QueryComponent from "@/components/Query/Query";
import { Container, Divider } from "@lawallet/ui";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <Container>
      <Divider y={16} />

      <Navbar />

      <Divider y={16} />

      <QueryComponent />
    </Container>
  );
}
