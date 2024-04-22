"use client";
import { NostrProvider } from "@lawallet/react";
import { NextProvider } from "@lawallet/ui/next";
import React from "react";

const AppProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <NextProvider>
      <NostrProvider>{children}</NostrProvider>
    </NextProvider>
  );
};

export default AppProvider;
