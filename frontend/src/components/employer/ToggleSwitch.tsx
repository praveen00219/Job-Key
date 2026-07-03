import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
}

/** Pill toggle switch matching the Notifications-types table in the design. */
export function ToggleSwitch({ checked, onCheckedChange, disabled, ...rest }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors",
        checked ? "justify-end bg-brand-400" : "justify-start bg-grey-100",
        disabled && "cursor-not-allowed opacity-60"
      )}
      {...rest}
    >
      <span className={cn("size-4 rounded-full bg-white", !checked && "bg-grey-300")} />
    </button>
  );
}
