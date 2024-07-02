import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import { Select } from "@/components/select";
import { useCreateAccount } from "@/features/accounts/api/useCreateAccount";
import { useGetAccounts } from "@/features/accounts/api/useGetAccounts";

export const useSelectAccount = (): [
  () => JSX.Element,
  () => Promise<string | undefined>
] => {
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const handleCreateAccount = (name: string) =>
    accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id
  }));

  const selectValue = useRef<string>();
  const handleValueChange = (value?: string) => {
    selectValue.current = value;
  };
  const disabled = accountQuery.isLoading || accountMutation.isPending;

  const [promise, setPromise] = useState<{
    resolve: (value?: string) => void;
  } | null>(null);

  const confirm = () =>
    new Promise((resolve: (value?: string) => void) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  };

  const ConfirmDialog = () => {
    return (
      <Dialog open={promise !== null}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Account</DialogTitle>
            <DialogDescription>
              Please select an account to continue.
            </DialogDescription>
          </DialogHeader>
          <Select
            placeholder="Select an account"
            options={accountOptions}
            onCreate={handleCreateAccount}
            onChange={handleValueChange}
            disabled={disabled}
          />
          <DialogFooter className="pt-2">
            <Button onClick={handleCancel} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return [ConfirmDialog, confirm];
};
