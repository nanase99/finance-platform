"use client";

import { useMountedState } from "react-use";

import { EditAccountSheet } from "@/features/accounts/components/editAccountSheet";
import { NewAccountSheet } from "@/features/accounts/components/newAccountSheet";
import { EditCategorySheet } from "@/features/categories/components/editCategorySheet";
import { NewCategorySheet } from "@/features/categories/components/newCategorySheet";

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
      <NewCategorySheet/>
      <EditCategorySheet/>
    </>
  );
};
