"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { client } from "@/sanity/lib/client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Button } from "./ui/button";
import { BookIcon } from "lucide-react";

export type SearchProduct = {
  name: string;
  slug: string;
};

// fetching api
async function getProducts() {
  const query = `*[_type == "product"]{
        name, 
        "slug": slug.current
      }`;
  const data = await client.fetch(query);
  return data;
}

export async function ProductSearch() {
  const data: SearchProduct[] = await getProducts();

  const [open, setOpen] = useState(false);

  return (
    <div className="hidden md:block">
      <Button
        variant="outline"
        className={cn(
          "relative w-full justify-start text-sm font-light text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
      >
        <span className="inline-flex">Search...</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />

        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup key={1} heading="Links" onClick={() => setOpen(false)}>
            {data?.map((item) => (
              <Link href={`/product/${item.slug}`} key={item.slug}>
                <CommandItem>
                  <div className="mr-2 flex h-4 items-center justify-center">
                    <BookIcon className="h-3" />
                  </div>
                  {item.name}
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
