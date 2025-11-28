import Link from "next/link";
import { ShoppingBasketIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/context";

/**
 * Cart navigation component
 * Displays shopping cart icon with item count badge
 */
export function CartNav() {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/cart">
      <Button size="icon" variant="outline" className="relative h-9">
        <ShoppingBasketIcon className="h-4" />
        {itemCount > 0 && (
          <span
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
            data-testid="cart-count"
          >
            {itemCount}
          </span>
        )}
      </Button>
    </Link>
  );
}
