"use client";

import { useMountedState } from "react-use";

import { EditAccountSheet } from "@/features/components/editAccountSheet";
import { NewAccountSheet } from "@/features/components/newAccountSheet";

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
    </>
  );
};
