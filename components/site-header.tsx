"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "./ui/button";
import { BookIcon, ShoppingBasketIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useState } from "react";
import { Input } from "./ui/input";

export default function Header() {
  const pathname = usePathname();
  
  if (pathname.startsWith("/studio")) return null;

  return (
    <header className="supports-backdrop-blur:bg-background/90 sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur mb-4 px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
      <div className="flex h-14 items-center">
        <MainNav />
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <div className="flex-none">
            <SearchBar />
          </div>
          <CartNav />
        </div>
      </div>
    </header>
  );
}

export function MainNav() {
  return (
    <div className="flex gap-4">
      <Link href="/" className="flex items-center">
        <span className="hidden font-medium sm:inline-block">
          The Bookish Retreat
        </span>
      </Link>
      <NavMenu />
    </div>
  );
}

export function NavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/products">
            <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-2 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
              <div className="font-normal text-foreground/70">Products</div>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <div className="font-normal text-foreground/70">Categories</div>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href={"/"}
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      The Bookish Retreat
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Step into our realm of boundless imagination and let the
                      magic of literature awaken your spirit.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href={"/category/fiction"} title="Fiction">
                Dive into worlds of imagination and creativity with our fiction
                collection.
              </ListItem>
              <ListItem href={"/category/poetry"} title="Poetry">
                Let your soul be stirred and your heart moved by the power of
                poetry.
              </ListItem>
              <ListItem href={"/category/essays"} title="Essays">
                Expand your mind and enrich your understanding with our
                thought-provoking essays.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({ className, title, children, href, ...props }: any) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

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

export function CartNav() {
  return (
    <Link href="/cart">
      <Button size="icon" variant="outline" className="h-9">
        <ShoppingBasketIcon className="h-4" />
      </Button>
    </Link>
  );
}

function SearchBar() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultSearchQuery = searchParams.get("search") ?? "";

  function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get("search");
    router.replace(`/products/?search=${searchQuery}`);
  }

  return (
    <form onSubmit={onSubmit} className="hidden items-center lg:inline-flex">
      <Input
        id="search"
        name="search"
        type="search"
        autoComplete="off"
        placeholder="Search products..."
        className="h-9 lg:w-[300px]"
        defaultValue={defaultSearchQuery}
      />
    </form>
  );
}
