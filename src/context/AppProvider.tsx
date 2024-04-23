"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { appTheme } from "@/config/theme";
import { NostrProvider } from "@lawallet/react";
import { Container, Divider } from "@lawallet/ui";
import { NextProvider } from "@lawallet/ui/next";
import React, { Suspense } from "react";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextProvider theme={appTheme}>
      <NostrProvider>
        <Suspense>
          <Container>
            <Navbar />

            <Divider y={16} />

            {children}

            <Divider y={16} />

            <Footer />
          </Container>
        </Suspense>
      </NostrProvider>
    </NextProvider>
  );
};

export default AppProvider;
