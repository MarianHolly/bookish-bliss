"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { MainNav } from "./main-nav";
import { SearchBar } from "./search-bar";
import { CommandMenu } from "./command-menu";
import { CartNav } from "./cart-nav";

/**
 * Site header component
 * Composition-only wrapper for all header sub-components
 * Renders logo, navigation, search bar, command menu, and cart
 */
export default function Header() {
  const pathname = usePathname();

  // Hide header in studio routes
  if (pathname.startsWith("/studio")) return null;

  return (
    <header className="supports-backdrop-blur:bg-background/90 sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur mb-4 px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
      <div className="flex h-14 items-center">
        <MainNav />
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <div className="flex-none">
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>
          <CommandMenu />
          <CartNav />
        </div>
      </div>
    </header>
  );
}
