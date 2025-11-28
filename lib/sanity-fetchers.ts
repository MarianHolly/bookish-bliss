/**
 * Sanity Data Fetchers
 *
 * Centralized data fetching layer for all Sanity CMS operations.
 * Handles parameterized queries, error handling, and consistent logging.
 *
 * All fetchers use query builders from lib/queries.ts
 */

import { client } from '@/sanity/lib/client';
import {
  productQueries,
  categoryQueries,
  publisherQueries,
} from './queries';
import type { Product, Category } from './interface';

/**
 * Fetch all products with optional filters
 */
export async function fetchProducts(
  categorySlug?: string,
  publisherSlug?: string,
  searchTerm?: string
): Promise<Product[]> {
  try {
    const query = productQueries.getAll(categorySlug, publisherSlug, searchTerm);
    const params: Record<string, string> = {};

    if (categorySlug) params.categorySlug = categorySlug;
    if (publisherSlug) params.publisherSlug = publisherSlug;
    if (searchTerm) params.searchTerm = searchTerm;

    const products = await client.fetch(query, params);
    return products || [];
  } catch (error) {
    console.error('Failed to fetch products', error);
    throw new Error('Failed to load products. Please try again later.');
  }
}

/**
 * Fetch single product by slug
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const query = productQueries.getBySlug();
    const product = await client.fetch(query, { slug });
    return product || null;
  } catch (error) {
    console.error('Failed to fetch product by slug', error);
    throw new Error('Failed to load product. Please try again later.');
  }
}

/**
 * Fetch products by category slug
 */
export async function fetchProductsByCategory(slug: string): Promise<Product[]> {
  try {
    const query = productQueries.getByCategory();
    const products = await client.fetch(query, { slug });
    return products || [];
  } catch (error) {
    console.error('Failed to fetch products by category', error);
    throw new Error('Failed to load category products. Please try again later.');
  }
}

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const query = productQueries.getCategories();
    const categories = await client.fetch(query);
    return categories || [];
  } catch (error) {
    console.error('Failed to fetch categories', error);
    throw new Error('Failed to load categories. Please try again later.');
  }
}

/**
 * Fetch single category by slug
 */
export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const query = categoryQueries.getBySlug();
    const category = await client.fetch(query, { slug });
    return category || null;
  } catch (error) {
    console.error('Failed to fetch category by slug', error);
    throw new Error('Failed to load category. Please try again later.');
  }
}

/**
 * Fetch bestseller products
 */
export async function fetchBestsellers(): Promise<Product[]> {
  try {
    const query = productQueries.getBestsellers();
    const products = await client.fetch(query);
    return products || [];
  } catch (error) {
    console.error('Failed to fetch bestsellers', error);
    throw new Error('Failed to load bestsellers. Please try again later.');
  }
}

/**
 * Fetch recent products
 */
export async function fetchRecent(): Promise<Product[]> {
  try {
    const query = productQueries.getRecent();
    const products = await client.fetch(query);
    return products || [];
  } catch (error) {
    console.error('Failed to fetch recent products', error);
    throw new Error('Failed to load recent products. Please try again later.');
  }
}

/**
 * Fetch all publishers
 */
export async function fetchPublishers(): Promise<any[]> {
  try {
    const query = productQueries.getPublishers();
    const publishers = await client.fetch(query);
    return publishers || [];
  } catch (error) {
    console.error('Failed to fetch publishers', error);
    throw new Error('Failed to load publishers. Please try again later.');
  }
}

/**
 * Fetch single publisher by slug
 */
export async function fetchPublisherBySlug(slug: string): Promise<any | null> {
  try {
    const query = publisherQueries.getBySlug();
    const publisher = await client.fetch(query, { slug });
    return publisher || null;
  } catch (error) {
    console.error('Failed to fetch publisher by slug', error);
    throw new Error('Failed to load publisher. Please try again later.');
  }
}
