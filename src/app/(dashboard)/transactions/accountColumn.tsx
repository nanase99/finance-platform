import { useOpenAccount } from "@/features/accounts/hooks/useOpenAccount";

type Props = {
  account: string;
  accountId: string;
};

export const AccountColumn = ({ account, accountId }: Props) => {
  const { onOpen: onOpenAccount } = useOpenAccount();
  const handleClick = () => {
    onOpenAccount(accountId);
  };
  return (
    <div
      onClick={handleClick}
      onKeyDown={handleClick}
      className="flex items-center cursor-pointer hover:underline"
    >
      {account}
    </div>
  );
};
