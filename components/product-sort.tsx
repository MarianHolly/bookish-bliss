"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Product sort dropdown component
 * Allows users to sort products by date
 */
export function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("date") || "desc";

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("date", value);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <Select defaultValue={currentSort} onValueChange={handleSort}>
      <SelectTrigger data-testid="sort-select" className="w-[180px]">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="desc">Newest First</SelectItem>
        <SelectItem value="asc">Oldest First</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default ProductSort;
