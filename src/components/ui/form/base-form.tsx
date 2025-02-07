"use client";

import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BaseFormProps<T extends z.ZodType> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  defaultValues?: Partial<z.infer<T>>;
  children: (form: ReturnType<typeof useForm<z.infer<T>>>) => ReactNode;
  className?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function BaseForm<T extends z.ZodType>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className,
  submitLabel = "Save",
  isSubmitting = false,
}: BaseFormProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as z.infer<T>,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-6", className)}
      >
        {children(form)}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
