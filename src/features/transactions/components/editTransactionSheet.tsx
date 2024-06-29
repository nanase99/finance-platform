import { Loader2 } from "lucide-react";
import type { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { insertTransactionSchema } from "@/db/schema";

import { useCreateCategory } from "@/features/categories/api/useCreateCategory";
import { useGetCategories } from "@/features/categories/api/useGetCategories";

import { useCreateAccount } from "@/features/accounts/api/useCreateAccount";
import { useGetAccounts } from "@/features/accounts/api/useGetAccounts";

import { useDeleteTransaction } from "@/features/transactions/api/useDeleteTransaction";
import { useEditTransaction } from "@/features/transactions/api/useEditTransaction";
import { useGetTransaction } from "@/features/transactions/api/useGetTransaction";

import { TransactionForm } from "@/features/transactions//components/transactionForm";
import { useOpenTransaction } from "@/features/transactions/hooks/useOpenTransaction";
import { useConfirm } from "@/hooks/useConfirm";

const formSchema = insertTransactionSchema.omit({ id: true });
type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();

  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id
  }));

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id
  }));

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction."
  );

  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    transactionQuery.isLoading ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading =
    transactionQuery.isLoading ||
    categoryQuery.isLoading ||
    accountQuery.isLoading;

  const handleSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    });
  };
  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteMutation.mutate(undefined, { onSuccess: () => onClose() });
  };

  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date
          ? new Date(transactionQuery.data.date)
          : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes
      }
    : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: ""
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit an existing transaction</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              defaultValues={defaultValues}
              disabled={isPending}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
