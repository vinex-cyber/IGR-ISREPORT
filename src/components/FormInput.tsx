import type { ReactNode } from "react";
import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

type FormInputProps<TFieldValues extends FieldValues> = {
  name: StringFieldName<TFieldValues>;
  placeholder?: string;
  onBlur?: (value: string) => void;
  required?: boolean;
  onInvalid?: () => void;
  iconRight?: ReactNode;
  onIconClick?: () => void;
  disabled?: boolean;
  className?: string;
};

const FormInput = <TFieldValues extends FieldValues>({
  name,
  placeholder,
  onBlur,
  required = false,
  onInvalid,
  iconRight,
  onIconClick,
  disabled = false,
  className,
}: FormInputProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="relative">
          <Input
            {...field}
            value={field.value ?? ""}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={cn(className, iconRight && "pr-10")}
            onInvalid={() => {
              if (required) {
                onInvalid?.();
              }
            }}
            onBlur={(event) => {
              field.onBlur();
              onBlur?.(event.target.value);
            }}
          />

          {iconRight && (
            <button
              type="button"
              disabled={disabled}
              onClick={onIconClick}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2",
                "text-gray-400 hover:text-black",
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              )}>
              {iconRight}
            </button>
          )}
        </div>
      )}
    />
  );
};

export default FormInput;
