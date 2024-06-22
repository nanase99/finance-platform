import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { insertAccountSchema } from "@/db/schema";
import { useConfirm } from "@/hooks/useConfirm";
import { Loader2 } from "lucide-react";
import type { z } from "zod";
import { useDeleteAccount } from "../accounts/api/useDeleteAccount";
import { useEditAccount } from "../accounts/api/useEditAccount";
import { useGetAccount } from "../accounts/api/useGetAccount";
import { useOpenAccount } from "../accounts/hooks/useOpenAccount";
import { AccountForm } from "./accountForm";

const formSchema = insertAccountSchema.pick({ name: true });
type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();

  const accountQuery = useGetAccount(id);
  const editMutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction"
  );

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = accountQuery.isLoading;

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

  const defaultValues = { name: accountQuery.data?.name || "" };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit an existing account</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              defaultValues={defaultValues}
              disabled={isPending}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
