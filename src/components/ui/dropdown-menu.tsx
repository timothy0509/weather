"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import { cn } from "@/lib/cn";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = DropdownMenuPrimitive.Content;
export const DropdownMenuItem = DropdownMenuPrimitive.Item;

export function DropdownMenuPanel(
  props: DropdownMenuPrimitive.DropdownMenuContentProps,
) {
  const { className, sideOffset = 6, ...rest } = props;

  return (
    <DropdownMenuContent
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-48 overflow-hidden rounded-[var(--radius)] border border-[rgb(var(--rule))]",
        "bg-[rgb(var(--card))] text-[rgb(var(--fg))] shadow-lg",
        "p-1",
        className,
      )}
      {...rest}
    />
  );
}

export function DropdownMenuItemButton(
  props: DropdownMenuPrimitive.DropdownMenuItemProps,
) {
  const { className, ...rest } = props;

  return (
    <DropdownMenuItem
      className={cn(
        "flex cursor-default select-none items-center rounded-[var(--radius)] px-3 py-2 text-sm outline-none",
        "text-[rgb(var(--fg))]",
        "focus:bg-[rgb(var(--fg)/0.06)] data-[highlighted]:bg-[rgb(var(--fg)/0.06)]",
        className,
      )}
      {...rest}
    />
  );
}
