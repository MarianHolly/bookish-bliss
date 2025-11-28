/**
 * GROQ Query Builders
 *
 * Centralized query definitions for all Sanity data fetching.
 * Uses parameterized queries to prevent injection vulnerabilities.
 *
 * All queries use parameter syntax: $slug, $searchTerm, etc.
 */

export const productQueries = {
  /**
   * Get all products with optional filters
   * Supports: category slug, publisher slug, search term
   */
  getAll: (categorySlug?: string, publisherSlug?: string, searchTerm?: string) => {
    let query = `*[_type == "product"`;

    if (categorySlug) {
      query += ` && references(*[_type=="category" && slug.current == $categorySlug]._id)`;
    }

    if (publisherSlug) {
      query += ` && references(*[_type=="publisher" && slug.current == $publisherSlug]._id)`;
    }

    if (searchTerm) {
      query += ` && name match $searchTerm`;
    }

    query += `] {
      "id": _id,
      "slug": slug.current,
      name,
      author,
      price,
      image,
      category[]-> {name, "slug": slug.current},
      publisher[]-> {name, "slug": slug.current},
      bestseller,
      recent
    }`;

    return query;
  },

  /**
   * Get single product by slug with full details
   */
  getBySlug: () => `*[_type == "product" && slug.current == $slug][0] {
    "id": _id,
    "slug": slug.current,
    name,
    author,
    price,
    image,
    body,
    description,
    isbn,
    category[]-> {name, "slug": slug.current},
    publisher[]-> {name, "slug": slug.current},
    bestseller,
    recent
  }`,

  /**
   * Get products by category slug
   */
  getByCategory: () => `*[_type == "product" && references(*[_type=="category" && slug.current == $slug]._id)][0..6] {
    "id": _id,
    "slug": slug.current,
    name,
    author,
    price,
    image,
    body
  }`,

  /**
   * Get all categories with basic info
   */
  getCategories: () => `*[_type == "category"] {
    "id": _id,
    "slug": slug.current,
    name,
    subtitle,
    image,
    description
  }`,

  /**
   * Get all publishers
   */
  getPublishers: () => `*[_type == "publisher"] {
    "id": _id,
    "slug": slug.current,
    name
  }`,

  /**
   * Get bestseller products
   */
  getBestsellers: () => `*[_type == "product" && bestseller == true] {
    "id": _id,
    "slug": slug.current,
    name,
    author,
    price,
    image
  }`,

  /**
   * Get recent products
   */
  getRecent: () => `*[_type == "product" && recent == true] {
    "id": _id,
    "slug": slug.current,
    name,
    author,
    price,
    image
  }`,
};

export const categoryQueries = {
  /**
   * Get single category by slug with full details
   */
  getBySlug: () => `*[_type == "category" && slug.current == $slug][0] {
    "id": _id,
    "slug": slug.current,
    name,
    subtitle,
    image,
    body,
    description
  }`,
};

export const publisherQueries = {
  /**
   * Get single publisher by slug
   */
  getBySlug: () => `*[_type == "publisher" && slug.current == $slug][0] {
    "id": _id,
    "slug": slug.current,
    name
  }`,
};
