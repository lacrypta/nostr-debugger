"use client";
import { NostrProvider } from "@lawallet/react";
import { NextProvider } from "@lawallet/ui/next";
import React, { Suspense } from "react";

const AppProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <NextProvider>
      <NostrProvider><Suspense>{children}</Suspense></NostrProvider>
    </NextProvider>
  );
};

export default AppProvider;
