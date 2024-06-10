import Link from "next/link";
import { Button } from "./button";
import { cn } from "@/src/lib/utils";

type Props = {
  href: string;
  label: string;
  isActive?: boolean;
};

export const NavButton = ({ href, label, isActive }: Props) => {
  return (
    <Button
      size="sm"
      variant="outline"
      asChild
      className={cn(
        "font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent focus:bg-white/30 outline-none text-white transition",
        isActive ? "bg-white/10" : "bg-transparent",
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};
