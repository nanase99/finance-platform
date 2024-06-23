import type { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { insertCategorySchema } from "@/db/schema";
import { useCreateCategory } from "@/features/categories/api/useCreateCategory";
import { useNewCategory } from "@/features/categories/hooks/useNewCategory";
import { CategoryForm } from "./categoryForm";

const formSchema = insertCategorySchema.pick({ name: true });
type FormValues = z.input<typeof formSchema>;

export const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory();

  const mutation = useCreateCategory();

  const handleSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to organize your transactions.
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={handleSubmit}
          defaultValues={{ name: "" }}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  );
};
