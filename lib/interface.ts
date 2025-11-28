import type { Image } from 'sanity';
import type { PortableTextBlock } from '@portabletext/types';

/**
 * Product interface mirrors Sanity product schema
 */
export interface Product {
  id: string;
  slug: string;
  name: string;
  author: string;
  price: number;
  quantity: number; // Always set in cart context
  image: Image;
  body?: PortableTextBlock[];
  description?: string;
  isbn?: string;
  category?: Array<{
    name: string;
    slug: string;
  }>;
  publisher?: Array<{
    name: string;
    slug: string;
  }>;
  bestseller?: boolean;
  recent?: boolean;
}

/**
 * Category interface mirrors Sanity category schema
 */
export interface Category {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  image: Image;
  description?: string;
  body?: PortableTextBlock[];
}

/**
 * Publisher interface mirrors Sanity publisher schema
 */
export interface Publisher {
  id: string;
  slug: string;
  name: string;
}
