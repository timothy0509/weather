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
  const { className, sideOffset = 8, ...rest } = props;

  return (
    <DropdownMenuContent
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-48 overflow-hidden rounded-2xl border border-[rgb(var(--border))]",
        "bg-[rgb(var(--card)/0.95)] text-[rgb(var(--fg))] shadow-[0_30px_70px_-60px_rgb(var(--shadow)/0.70)] backdrop-blur-xl",
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
        "flex cursor-default select-none items-center rounded-xl px-3 py-2 text-sm outline-none",
        "text-[rgb(var(--fg))]",
        "focus:bg-[rgb(var(--fg)/0.06)] data-[highlighted]:bg-[rgb(var(--fg)/0.06)]",
        className,
      )}
      {...rest}
    />
  );
}
