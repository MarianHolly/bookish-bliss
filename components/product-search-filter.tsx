"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import type { Category } from "@/lib/interface";

interface ProductSearchFilterProps {
  categories: Category[];
}

/**
 * Product search and filter component
 * Allows users to:
 * - Search for products by name
 * - Filter by category
 */
export function ProductSearchFilter({
  categories,
}: ProductSearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (checked) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-sm mb-3">Search</h3>
        <Input
          type="text"
          placeholder="Search products..."
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("search") || ""}
          data-testid="search-input"
        />
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={searchParams.get("category") === category.id}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.id, checked as boolean)
                }
                data-testid={`category-${category.id}`}
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
