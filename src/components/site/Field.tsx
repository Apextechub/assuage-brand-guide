import { ChevronDown } from "lucide-react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const controlClasses =
  "w-full border border-rule bg-paper px-4 py-3 text-base text-ink transition-colors duration-200 placeholder:text-ink-soft/50 hover:border-ink-soft/40 focus:border-navy disabled:cursor-not-allowed disabled:bg-mist aria-[invalid=true]:border-destructive";

export function Field({
  label,
  htmlFor,
  error,
  required = false,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string | undefined;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-ink">
        {label}
        {required && (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(controlClasses, props.className)} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea rows={6} {...props} className={cn(controlClasses, "resize-y", props.className)} />
  );
}

export function SelectInput({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={cn(controlClasses, "appearance-none pr-11", props.className)}>
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
        aria-hidden="true"
      />
    </div>
  );
}
