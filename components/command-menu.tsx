"use client";

import Link from "next/link";
import { useState } from "react";
import { BookIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

/**
 * Command menu (search/command palette)
 * Hidden on smaller screens, shown on medium and up
 */
export function CommandMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="hidden md:block">
      <Button
        variant="outline"
        className={cn(
          "relative w-full justify-start text-sm font-light text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        )}
      >
        <span className="inline-flex">Search...</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />

        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup key={1} heading="Links">
            <Link href={`/product/no-longer-human`}>
              <CommandItem>
                <div className="mr-2 flex h-4 items-center justify-center">
                  <BookIcon className="h-3" />
                </div>
                No Longer Human
              </CommandItem>
            </Link>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
