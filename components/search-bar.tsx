"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { Suspense } from "react";

/**
 * Search bar component
 * Allows users to search products
 * Only visible on large screens (lg breakpoint)
 */
function SearchBarContent() {
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
        data-testid="search-input"
      />
    </form>
  );
}

export function SearchBar() {
  return (
    <Suspense>
      <SearchBarContent />
    </Suspense>
  );
}
