'use client';

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Controller, type ControllerProps, type FieldPath, type FieldValues, FormProvider, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "./label";

const Form = FormProvider;

const FormField = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return <Controller {...props} />;
};

interface FormItemContextValue {
  id: string;
}

const FormItemContext = React.createContext<FormItemContextValue>({ id: "" });

const useFormField = () => {
  const fieldContext = useFormContext();
  const itemContext = React.useContext(FormItemContext);
  const itemId = itemContext.id;
  const fieldState = fieldContext.getFieldState(itemId, fieldContext.formState);

  if (!itemId) {
    throw new Error("Form components must be used within <FormItem>");
  }

  return {
    id: itemId,
    formItemId: `${itemId}-form-item`,
    formDescriptionId: `${itemId}-form-item-description`,
    formMessageId: `${itemId}-form-item-message`,
    ...fieldState,
  };
};

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("grid gap-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  const { formItemId } = useFormField();
  return <Label ref={ref} htmlFor={formItemId} className={className} {...props} />;
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { formItemId, formDescriptionId, formMessageId, invalid } = useFormField();
  const describedBy = invalid ? `${formDescriptionId} ${formMessageId}` : formDescriptionId;

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={describedBy}
      aria-invalid={invalid ? "true" : "false"}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return (
    <p ref={ref} id={formDescriptionId} className={cn("text-xs text-text-tertiary", className)} {...props} />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { formMessageId, error } = useFormField();
  const body = error ? String(error.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p ref={ref} id={formMessageId} className={cn("text-xs font-medium text-danger", className)} {...props}>
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage };
